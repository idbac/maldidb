#* Example query:
#* $ curl -H "Content-Type: application/json" --data '{"ids":[1,2,3]}'
#*   http://localhost:8000/sum

suppressPackageStartupMessages(library(IDBacApp))
require('RPostgreSQL')
library(curl)
library(jsonlite)

#* Echo
#*
#* @get /test
function() {
  return(
    list(name = 'Test')
  )
}

#* Return driver and connection
connect <- function() {
  # env variables
  POSTGRES_USER <- Sys.getenv('POSTGRES_USER')
  POSTGRES_PASSWORD <- Sys.getenv('POSTGRES_PASSWORD')
  POSTGRES_DB <- Sys.getenv('POSTGRES_DB')
  DATABASE_HOST <- Sys.getenv('DATABASE_HOST')
  DATABASE_PORT <- Sys.getenv('DATABASE_PORT')
  drv <- dbDriver('PostgreSQL')
  con <- dbConnect(
    drv, dbname = POSTGRES_DB,
    host = DATABASE_HOST, port = DATABASE_PORT,
    user = POSTGRES_USER, password = POSTGRES_PASSWORD
  )
  list('drv' = drv, 'con' = con)
}
disconnect <- function(driver, connection) {
  dbDisconnect(connection)
  dbUnloadDriver(driver)
}

# auxiliary print function
print.data.frame <- function (
  x, ..., maxchar=20, digits = NULL, quote = FALSE, right = TRUE,
  row.names = TRUE) 
{
  x <- as.data.frame(
    lapply(x, function(xx) {
      if (is.character(xx))
        paste0(substr(xx, 1, maxchar), '...')
      else if (is.list(xx))
        xx
      else xx
    })
  )
  base::print.data.frame(
    x, ..., digits=digits, quote=quote, right=right, 
    row.names=row.names
  )
}

#* cosineLibCompare
#* Returns full result of cosine similarity of one or more libraries
#* @param ids Ids of one or more libraries
#* @return Similarity: [0:[scores 1-n], 1:[scores 1-n], ...], and
#*   Ids: [0:[spectraid, libraryid], 1:[spectraid, libraryid], ...]
#* @post /cosineLibCompare
function(req, ids) {
  print(ids)
  ids <- as.numeric(ids)
  if (sum(is.na(ids)) != 0) {
    stop('ids contain non-numerics!')
  }
  print('retrieving db spectra')
  s <- dbLibrarySpectra(ids)
  print('trimming')
  allPeaks <- MALDIquant::trim(s['peaks']$peaks, c(3000, 15000))
  print('binning')
  binnedPeaks <- MALDIquant::binPeaks(allPeaks, tolerance = 0.002)
  print('calculating intensity matrix')
  featureMatrix <- MALDIquant::intensityMatrix(binnedPeaks, s['spectra']$spectra)
  
  print('calculating cosine score')
  d <- coop::cosine(t(featureMatrix))
  d <- round(d, 3)
  
  return(list(
    'similarity' = d,
    'ids' = s['ids']$ids,
    'lib_ids' = s['lib_ids']$lib_ids
  ))
}

#* Cosine_disttest
#* @post /cosine_disttest
function(req, ids) {
  ids <- as.numeric(ids)
  if (length(ids) < 2) {
    stop('less than two comparison ids given!')
  }
  
  # s1 / s2 required to contain one or more db results
  s1 <- dbSpectra(ids[[1]])
  s2 <- dbSpectra(ids[2:length(ids)])
  allPeaks <- do.call(c, c(s1['peaks'], s2['peaks']))
  
  allPeaks <- MALDIquant::trim(allPeaks, c(3000, 15000))

  emptyProtein <- unlist(
    lapply(allPeaks, MALDIquant::isEmpty)
  )
  
  proteinMatrix <- IDBacApp:::createFuzzyVector(
    massStart = 3000,
    massEnd = 15000,
    ppm = 1000,
    massList = lapply(allPeaks[!emptyProtein], function(x) x@mass),
    intensityList = lapply(allPeaks[!emptyProtein], function(x) x@intensity))
  x <- IDBacApp:::idbac_dendrogram_creator(
    bootstraps = 100,
    distanceMethod = 'cosine',
    clusteringMethod = 'average',
    proteinMatrix
  )

  print(ids)
  print(x['distance'])
  return()
  # ...
}

#* Cosine: Get cosine scores for a set of db spectra
#* Ids must correlate to at least 2 rows
#* Initial cut-offs of 3k and 15k.
#* @param req Built-in
#* @param ids List of IDs from Spectra table
#* @return Returns first cos. similarity matrix row, and binnedPeaks data
#* @post /cosine
function(req, ids) {
  ids <- as.numeric(ids)
  if (length(ids) < 2) {
    stop('less than two comparison ids given!')
  }
  
  # s1 / s2 required to contain one or more db results
  s1 <- dbSpectra(ids[[1]])
  s2 <- dbSpectra(ids[2:length(ids)])
  allPeaks <- do.call(c, c(s1['peaks'], s2['peaks']))
  allSpectra <- do.call(c, c(s1['spectra'], s2['spectra']))
  
  allPeaks <- MALDIquant::trim(allPeaks, c(3000, 15000))
  allSpectra <- MALDIquant::trim(allSpectra, c(3000, 15000))
  
  binnedPeaks <- MALDIquant::binPeaks(allPeaks, tolerance = 0.002)
  
  featureMatrix <- MALDIquant::intensityMatrix(binnedPeaks, allSpectra)
  
  b <- list()
  for(i in 1:length(binnedPeaks)) {
    s <- binnedPeaks[[i]]
    b <- append(b, list(list(
      'mass' = MALDIquant::mass(s),
      'intensity' = MALDIquant::intensity(s),
      'snr' = MALDIquant::snr(s),
      'csId' = ids[[i]]
    )))
  }
  d <- coop::cosine(t(featureMatrix))
  d <- round(d, 3)
  
#~   allPeaks <- MALDIquant::trim(
#~     allPeaks, c(3000, 15000)
#~   )
  emptyProtein <- unlist(
    lapply(allPeaks, MALDIquant::isEmpty)
  )
  
  proteinMatrix <- IDBacApp:::createFuzzyVector(
    massStart = 3000,
    massEnd = 15000,
    ppm = 1000,
    massList = lapply(allPeaks[!emptyProtein], function(x) x@mass),
    intensityList = lapply(allPeaks[!emptyProtein], function(x) x@intensity))
  x <- IDBacApp:::idbac_dendrogram_creator(
    bootstraps = 0L,
    distanceMethod = 'cosine',
    clusteringMethod = 'average',
    proteinMatrix
  )

  tree1 <- data.tree::as.Node(x['dendrogram']$dendrogram)
  
  # from list to json
  # https://www.r-bloggers.com/2015/05/
  #  convert-data-tree-to-and-from-list-json-networkd3-and-more/
  return(list(
    'similarity' = d[1,],
    'binnedPeaks' = b,
    'dendro' = toJSON(as.list(tree1, unname = TRUE))#,
#~     'dendro2' = toJSON(list(
#~       merges=cluster,
#~       seq=hc$labels,
#~       order=hc$order,
#~       maxHeight=max(hc$height)
#~     ))
  ))
  
  ## not used
  # visualizes sparse matrix
  
  # 200k rows
  ordering <- sort(d, decreasing = F, index.return = T)
  ordering <- ordering$ix
  print(ordering)
  pmReorder <- proteinMatrix[, ordering]
  
  png(file = 'scatterplot.png',  width = 10, height = 10, units = 'in', res = 600)
  image(
    t(as.matrix(pmReorder)[1:10000,]),
    axes = FALSE,
    col = colorRampPalette(c("white", "darkorange", "black"))(30),
    breaks = c(seq(0, 3, length.out = 30), 1), #, 100)
    main = "Reduced matrix",
    useRaster = TRUE
  )
  dev.off()
  
  # times 1 when first column is not 0, otherwise 0
  x <- proteinMatrix * ceiling(proteinMatrix[, 1])
  
  # times first column
  # x <- proteinMatrix * proteinMatrix[, 1]

  x <- x[, ordering]
  png(file = 'scatterplot2.png',  width = 10, height = 10, units = 'in', res = 600)
  image(
    t(as.matrix(x)[1:10000,]),
    axes = FALSE,
    col = colorRampPalette(c("white", "darkorange", "black"))(30),
    breaks = c(seq(0, 3, length.out = 30), 1), #, 100)
    main = "Reduced matrix",
    useRaster = TRUE
  )
  dev.off()
  
  redim_matrix <- function(
    mat,
    target_height = 100,
    target_width = 100,
    summary_func = function(x) max(x, na.rm = TRUE),
    output_type = 0.0, #vapply style
    n_core = 1 # parallel processing
    ) {

    if(target_height > nrow(mat) | target_width > ncol(mat)) {
      stop("Input matrix must be bigger than target width and height.")
    }

    seq_height <- round(seq(1, nrow(mat), length.out = target_height + 1))
    seq_width  <- round(seq(1, ncol(mat), length.out = target_width  + 1))

    # complicated way to write a double for loop
    do.call(rbind, parallel::mclapply(seq_len(target_height), function(i) { # i is row
      vapply(seq_len(target_width), function(j) { # j is column
        summary_func(
          mat[
            seq(seq_height[i], seq_height[i + 1]),
            seq(seq_width[j] , seq_width[j + 1] )
            ]
        )
      }, output_type)
    }, mc.cores = n_core))
  }
  
  # genmatred <- redim_matrix(as.matrix(pmReorder), target_height = 600, target_width = 50) 
  g <- redim_matrix(as.matrix(x), target_height = 1000, target_width = ncol(x)) 
  png(file = 'scatterplot3.png')
  image(
    t(g),
    axes = F,
    col = colorRampPalette(c("white", "darkorange", "black"))(30),
    breaks = c(seq(0, 3, length.out = 30), 1), #, 100)
    main = "Reduced matrix",
    useRaster = T
  )
  dev.off()
  
  return(d)
}

# Helper function to retrieve all spectra from one or more libraries
dbLibrarySpectra <- function(ids) {
  c <- connect()
  #id <- as.numeric(id)
  s <- paste(unlist(ids), collapse = ',')
  s <- paste0('SELECT peak_mass, peak_intensity, peak_snr, id, library_id
    FROM spectra_collapsedspectra
    WHERE library_id IN (', s, ') AND max_mass > 6000 ORDER BY id ASC')
  q <- dbGetQuery(c$con, s)
  if (nrow(q) < 1) {
    disconnect(c$drv, c$con)
    stop('database returned less than one row!')
  }
    
  allSpectra = list()
  allPeaks = list()
  ids = list()
  lib_ids = list()
  
  # q&d initial solution: requires monotonically increasing ids
  ix <- 0
  
  for(i in 1:nrow(q)) {
    row <- q[i,]
    if (row$id < ix) {
      stop('results non-monotonic')
    }
    allPeaks <- append(allPeaks,
      MALDIquant::createMassPeaks(
        mass = as.numeric(strsplit(row$peak_mass, ",")[[1]]),
        intensity = as.numeric(strsplit(row$peak_intensity, ",")[[1]]),
        snr = as.numeric(strsplit(row$peak_snr, ",")[[1]]))
    )
    allSpectra <- append(allSpectra,
      MALDIquant::createMassSpectrum(
        mass = as.numeric(strsplit(row$peak_mass, ",")[[1]]),
        intensity = as.numeric(strsplit(row$peak_intensity, ",")[[1]]))
    )
    ids <- append(ids, row$id)
    lib_ids <- append(lib_ids, row$library_id)
  }
  disconnect(c$drv, c$con)
   
  list('peaks' = allPeaks, 'spectra' = allSpectra, 'ids' = ids, 'lib_ids' = lib_ids)
}

# Helper function to retrieve list of IDs from Django's DB
dbSpectra <- function(ids) {
  c <- connect()
  s <- paste(unlist(ids), collapse = ',')
  s <- paste0('SELECT peak_mass, peak_intensity, peak_snr, id
    FROM spectra_collapsedspectra
    WHERE id IN (', s, ')')
  q <- dbGetQuery(c$con, s)
  if (nrow(q) < 1) {
    disconnect(c$drv, c$con)
    stop('database returned less than one row (spectra)!')
  }
    
  allSpectra = list()
  allPeaks = list()
  
  # q&d initial solution: require monotonically increasing ids
  id <- 0
  
  for(i in 1:nrow(q)) {
    row <- q[i,]
    if (row$id < id) {
      stop('results non-monotonic')
    }
    allPeaks <- append(allPeaks,
      MALDIquant::createMassPeaks(
        mass = as.numeric(strsplit(row$peak_mass, ",")[[1]]),
        intensity = as.numeric(strsplit(row$peak_intensity, ",")[[1]]),
        snr = as.numeric(strsplit(row$peak_snr, ",")[[1]]))
    )
    allSpectra <- append(allSpectra,
      MALDIquant::createMassSpectrum(
        mass = as.numeric(strsplit(row$peak_mass, ",")[[1]]),
        intensity = as.numeric(strsplit(row$peak_intensity, ",")[[1]]))
    )
  }
  disconnect(c$drv, c$con)
   
  list('peaks' = allPeaks, 'spectra' = allSpectra)
}

#* Collapse every strain in a given library
#* @param id Library id to collapse
#* @param owner User undertaking the process
#* @param taskId Reference to a Django user task
#* @get /collapseLibrary
collapseLibrary <- function(id, owner = F) {
  c <- connect()
  s <- paste0('SELECT distinct(strain_id) as strain_id
    FROM spectra_spectra
    WHERE library_id = ', as.numeric(id))
  q <- dbGetQuery(c$con, s)
  if (nrow(q) < 1) {
    disconnect(c$drv, c$con)
    stop('no strain IDs in library!')
  }
  disconnect(c$drv, c$con)
  for(i in 1:nrow(q)) {
    row <- q[i,]
    print(paste0(
      'collapsing pr/sm for strain_id: ', as.character(row), '...'
    ))
    collapseStrainsInLibrary(id, row, 'PR', owner)
    collapseStrainsInLibrary(id, row, 'SM', owner)
  }
}
#* Collapse a single strain (sid) from a single library (lid)
#* e.g. http://localhost:7002/collapseLibraryStrains?lid=1&sid=1&type=protein
#* @param lid
#* @param sid
#* @param type: protein or sm
#* @param owner: User undertaking the process, or None for anonymous
#* @get /collapseStrainsInLibrary
collapseStrainsInLibrary <- function(lid, sid, type, owner) {
  lid <- as.numeric(lid)
  sid <- as.numeric(sid)
#~   if (owner == F) {
#~     print('owner is anon.')
#~     owner <- ''
#~   } else {
#~     print('owner is not anon.')
#~     owner <- paste0('"created_by":"', as.numeric(owner), '",')
#~   }
  owner <- paste0('"created_by":"', as.numeric(owner), '",')
  if (type == 'PR')
    sym <- '>'
  else {
    sym <- '<'
    type <- 'SM' # validate
  }
  c <- connect()
  s <- paste0('SELECT peak_mass, peak_intensity, peak_snr, id
    FROM spectra_spectra
    WHERE library_id = ', as.numeric(lid), ' AND strain_id = ',
    as.numeric(sid), ' AND max_mass ', sym, ' 6000'
  )
  q <- dbGetQuery(c$con, s)
  if (nrow(q) < 1) {
    print(paste0('collapseStrainsInLibrary: no strain IDs in library - ',
      as.numeric(lid), '|', as.numeric(sid)))
    disconnect(c$drv, c$con)
    return()
  } else if (nrow(q) < 2) {
    # library + strain produce only one spectra
    # allow ?
    #disconnect(c$drv, c$con)
    #return()
  }
  
  allPeaks = list()
  strainIds = c()
  
  for(i in 1:nrow(q)) {
    row <- q[i,]
    strainIds <- append(strainIds, row$id)
    allPeaks <- append(allPeaks,
      MALDIquant::createMassPeaks(
        mass = as.numeric(strsplit(row$peak_mass, ",")[[1]]),
        intensity = as.numeric(strsplit(row$peak_intensity, ",")[[1]]),
        snr = as.numeric(strsplit(row$peak_snr, ",")[[1]]))
    )
  }
  disconnect(c$drv, c$con)
  
  t <- MALDIquant::binPeaks(allPeaks, tolerance = 0.002)
  
  # minFrequency: double, remove all peaks which occur in less than
  #  minFrequency*length(l) '>MassPeaks objects. It is a relative threshold.
  # minNumber: double, remove all peaks which occur in less than
  #  minNumber '>MassPeaks objects. It is an absolute threshold.
  # e.g. minNumber = 1
  
  t <- MALDIquant::filterPeaks(t, minFrequency = 70 / 100)
  t <- MALDIquant::mergeMassPeaks(t, method = 'mean')
  
  # Save to Django's DB
  h <- new_handle()
  x <- paste0(
    '{',
      '"spectrum_mass_hash":"', IDBacApp:::hashR(mqSerial(MALDIquant::mass(t))), '",',
      '"spectrum_intensity_hash":"', IDBacApp:::hashR(mqSerial(MALDIquant::mass(t))), '",',
      '"peak_mass":', mqSerial(MALDIquant::mass(t)), ',',
      '"peak_mass":', mqSerial(MALDIquant::mass(t)), ',',
      '"peak_intensity":', mqSerial(MALDIquant::intensity(t)), ',',
      '"peak_snr":', mqSerial(MALDIquant::snr(t)), ',',
      '"max_mass":', as.character(round(max(MALDIquant::mass(t)))), ',',
      '"min_mass":', as.character(round(min(MALDIquant::mass(t)))), ',',
      '"strain_id":', as.character(sid), ',',
      '"library":', as.character(lid), ',',
      '"min_snr":0.25,',
      '"tolerance":0.002,',
      '"peak_percent_presence":0.7,',
      '"spectra_content":"', as.character(type), '",',
      owner,
      '"collapsed_spectra":', toJSON(strainIds),
    '}'
  )
  handle_setheaders(h,
    'Content-Type' = 'application/json',
    'Cache-Control' = 'no-cache'
  )
  handle_setopt(h, copypostfields = x)
  req <- curl_fetch_memory('http://django:8000/spectra/cs/', handle = h)
  if (req$status_code >= 300) {
    #stop('status code:', req$status_code)
    # In one case, this occurs when trying to insert a non-unique 
    # (spectrum_mass_hash, spectrum_intensity_hash, library) into the db.
    # In this case it fails without warning.
  }
}
#* @param l: List to serialize
mqSerial <- function(l) {
  as.character(paste0('"', paste(l, collapse = ','), '"'))
}

#* Preprocess: Preprocesses a spectra file upload
#* @param file File path to preprocess
#* @return File path of resulting sqlite file, or empty in the case of 
#*   WARN or ERROR.
#* @get /preprocess
preprocess <- function(file) {
  library(stringr)
  tryCatch({
    mzFilePaths <- list(file.path(paste0('/app/', file)))
    sID <- base::basename(tools::file_path_sans_ext(mzFilePaths))
    # Replaces the Django portion of filename ("_[\w\d]+$")
    sID <- str_replace(sID, '_[a-zA-Z0-9]+$', '')
    f <- sanitize(sub('uploads/sync', '', file))
    IDBacApp:::idbac_create(
      fileName = f,
      filePath = './uploads/sync')
    idbacPool <- IDBacApp:::idbac_connect(
      fileName = f,
      filePath = './uploads/sync/')[[1]]
    IDBacApp:::spectraProcessingFunction(
      rawDataFilePath = file.path(paste0('/app/', file)),
      sampleID = sID,
      pool = idbacPool,
      acquisitionInfo = NULL,
    )
  },
  warning = function(warn) {
    print(paste("preprocess WARN:", warn))
    #return('')
  },
  error = function(err) {
    print(paste("preprocess ERROR: ", err))
    return('')
  },
  finally = function(f) {
    #print(paste("e: ", e))
  })
  
  tryCatch({
    if (file.exists(paste0('/app/', file))) {
      file.remove(paste0('/app/', file))
    }
  })
  
  # Returns location of idbac sqlite file
  return(f)
}
sanitize <- function(filename, replacement = "") {
  illegal <- "[/\\?<>\\:*|\":]"
  control <- "[[:cntrl:]]"
  reserved <- "^[.]+$"
  windows_reserved <- "^(con|prn|aux|nul|com[0-9]|lpt[0-9])([.].*)?$"
  windows_trailing <- "[. ]+$"
  
  filename <- gsub(illegal, replacement, filename)
  filename <- gsub(control, replacement, filename)
  filename <- gsub(reserved, replacement, filename)
  filename <- gsub(windows_reserved, replacement, filename, ignore.case = TRUE)
  filename <- gsub(windows_trailing, replacement, filename)
  filename <- gsub("\\.","_", filename)
  filename <- gsub(" ", "_", filename)
  
  while (grepl("__", filename)) {
    filename <- gsub("__","_", filename)
  }
  
  # TODO: this substr should really be unicode aware, so it doesn't chop a
  # multibyte code point in half.
  filename <- substr(filename, 1, 50)
  if (replacement == "") {
    return(filename)
  }
  sanitize(filename, "")
}

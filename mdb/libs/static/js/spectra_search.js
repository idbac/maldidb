
function updateFileList(input) {
  // file-listing
  if (!input)
    input = document.getElementById('customFile');
  $('#file-selector').css('display', 'none');
  for (var i in input.files) {
    input.files[i].upload = i;
    input.files[i].preprocess = i;
  }
  var t = $('#file-listing').DataTable({
    data: input.files,
    columns: [
      {data: 'name', title: 'Name'},
      {data: 'size', title: 'Size',
        render: function(data, type) {
          if (data < 1024)
            return data + ' bytes';
          else if (data < 1024*1000)
            return Math.round(data/1024) + 'KB';
          else if (data < 1024*1000000)
            return Math.round(data/(1024*1000)) + 'MB';
          else if (data < 1024*1000000000)
            return Math.round(data/(1024*1000000)) + 'GB';
          else 
            return data + ' bytes';
        }
      },
      {data: 'upload', title: 'Upload status',
        render: function(data, type) {
          return '<span id="filetable-upload' + data + '"></span>';
        }
      },
      {data: 'preprocess', title: 'Preprocess status',
        render: function(data, type) {
          return '<div id="filetable-preprocess' + data + '" style="text-align:center;width:100%;"></div>';
        }
      },
      //~ {data: 'phylum', title: 'Phylum'},
      //~ {data: 'class', title: 'Class'},
      //~ {data: 'order', title: 'Order'},
      //~ {data: 'genus', title: 'Genus'},
      //~ {data: 'species', title: 'Species'},
    ]
  });
  //~ t.order([0, 'desc']) // reorder in correct direction
    //~ .draw();
  t.draw();
}
function toggleSearchTypeOpts(e) {
  var s = $('#div-searchtype-opts');
  if (s.css('display') == 'none') {
    s.css('display', 'block');
    $(this).text('Hide file options')
  } else {
    s.css('display', 'none');
    $(this).text('Additional file options')
  }
  return false;
}
function toggleNavSearch(e) {
  $('#nav-search-source a').removeClass('active');
  //~ $('.nav-link').removeClass('active');
  $(this).addClass('active');
  
  //~ $('#nss-card-1').addClass('toggle-display');
  //~ $('#nss-card-2').addClass('toggle-display');
  //~ $('#nss-card-3').addClass('toggle-display');
  $('#nss-card-1').css('display', 'none');
  $('#nss-card-2').css('display', 'none');
  $('#nss-card-3').css('display', 'none');
  
  //~ for (var i=1; i<=3; i++) {
    //~ $('#nss-card-'+i).addClass('toggle-display');
  //~ }
  
  var n = $(this).attr('id').split('-')[1]; // e.g. "nss-1"
  $('#nss-card-' + n).css('display', 'block');
  //~ $('#nss-card-' + n).removeClass('toggle-display');
  
  e.preventDefault();
  e.stopPropagation();
  return false;
}
function toggleUploadOpts(e) {
  var s = $('#div-upload-opts');
  if (s.css('display') == 'none') {
    s.css('display', 'block');
    $(this).text('Hide more options')
  } else {
    s.css('display', 'none');
    $(this).text('Show more options')
  }
  return false;
}
function toggleSaveToLibrary(e) {
  if (this.checked) {
    var s = document.getElementsByName('library_save_type');
    var found = false;
    for (var i=0; i<s.length; i++) {
      if (s[i].checked) found = true;
    }
    if (!found) {
      s[0].checked = true; // default selection
      $('#id_library_select')[0].disabled = true;
      $('#id_library_create_new')[0].disabled = true;
    } else if (s[1].checked) {
      $('#id_library_select')[0].disabled = true;
      $('#id_library_create_new')[0].disabled = false;
    } else if (s[2].checked) {
      $('#id_library_select')[0].disabled = false;
      $('#id_library_create_new')[0].disabled = true;
    }
    document.getElementsByName('library_save_type')[0].disabled = false;
    document.getElementsByName('library_save_type')[1].disabled = false;
    document.getElementsByName('library_save_type')[2].disabled = false;
  } else {
    document.getElementsByName('library_save_type')[0].disabled = true;
    document.getElementsByName('library_save_type')[1].disabled = true;
    document.getElementsByName('library_save_type')[2].disabled = true;
    document.getElementsByName('library_save_type')[0].checked = false;
    document.getElementsByName('library_save_type')[1].checked = false;
    document.getElementsByName('library_save_type')[2].checked = false;
    $('#id_library_select')[0].disabled = true;
    $('#id_library_create_new')[0].disabled = true;
  }
}
function toggleSearchForm() {
  var st = $('#search_toggle');
  var si = $('#search_initial');
  if (st.css('display') == 'none') {
    st.css('display', 'block');
    si.css('display', 'none');
  } else {
    st.css('display', 'none');
    si.css('display', 'block');
  }
}

function toggleAddlFields() {
  $('.search-addl-fields').toggleClass('toggle-display');
  if ($(this).text() == 'Additional search options') {
    $(this).text('Hide search options');
  } else {
    $(this).text('Additional search options');
  }
  return false;
}
//~ $(document).ready(function(){
window.addEventListener('DOMContentLoaded', (event) => {
  
  //~ var show_tbl = {{ form.show_tbl|lower }};
  //~ var st = $('#search_toggle');
  //~ var si = $('#search_initial');
  //~ if (show_tbl) {
    //~ st.css('display', 'block');
    //~ si.css('display', 'none');
  //~ } else {
    //~ st.css('display', 'none');
    //~ si.css('display', 'block');
  //~ }
  //~ st.click(toggleSearchForm);
  
  // toggle nav search
  //~ $('.nav-link').click(toggleNavSearch);
  
  // toggle search options
  $('#toggle-search-opts').click(toggleAddlFields);
  
  // toggle search options
  // turn off for now
  $('#nav-search-source a').click(toggleNavSearch);
  
  // search type opts
  $('#searchtype-more-opts').click(toggleSearchTypeOpts);
  
  // save to library
  $('#id_save_to_library').click(toggleSaveToLibrary);
  
  // upload more opts
  $('#upload-more-opts').click(toggleUploadOpts);
  
  // upload
  $('#upload_form').submit(upload);
  
  // toggles branch length on dendrogram
  $('#dendro-viz-toggle').click(function(event) {
    var input = $('#dendro-viz-toggle input')[0];
    //~ console.log('ic1:',input.checked);
    input.checked = (input.checked) ? false : true;
    //~ console.log('ic2:',input.checked);
    input.chart.update(input.checked);
    event.preventDefault();
    event.stopPropagation();
  });
  
  // library type
  var x = document.getElementsByName('library_save_type');
  for (var i=0; i<x.length; i++) {
    x[i].onclick = function() {
      if (this.value == 'RANDOM') {
        $('#id_library_select')[0].disabled = true;
        $('#id_library_create_new')[0].disabled = true;
      } else if (this.value == 'NEW') {
        $('#id_library_select')[0].disabled = true;
        $('#id_library_create_new')[0].disabled = false;
      } else {
        $('#id_library_select')[0].disabled = false;
        $('#id_library_create_new')[0].disabled = true;
      }
    }
  }
  
  //
  $('#add-form').click(function() {
    var index = $('#id_inline_test_models-TOTAL_FORMS').val()
    var newTable = $('#id_inline_test_models-__prefix__-DELETE').parents('table').clone()
    newTable.find(':input').each(function() {
      for (attr of ['name', 'id'])
        $(this).attr(
          attr,
          $(this).attr(attr).replace('__prefix__', index)
        )
    })
    newTable.insertBefore($(this))
    $('#id_inline_test_models-TOTAL_FORMS').val(
      parseInt($('#id_inline_test_models-TOTAL_FORMS').val()) + 1
    )
    newTable.slideDown()
  })
  
});

// works locally & remotely
var socket = new WebSocket('ws://' + location.host + '/ws/pollData');
     
socket.onopen = function(e){
  console.log(e);
}
function getSubgroups(data) {

  // Selected taxonomy e.g. "kingdom"
  var s = document.getElementById('select-histo');
  var subgroups = d3.map(data.scores, function(d) {
    return d[s.selected];
    //~ return (d[selected])
  });

  return [...new Set(subgroups)]; // spread operator
}
function drawHisto() {
  var data = document.getElementById('select-histo').data;
  var selected = document.getElementById('select-histo').selected;
  
  var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
  if (document.getElementById('svg-histo')) {
    document.getElementById('svg-histo').parentNode
      .removeChild(document.getElementById('svg-histo'))
  }
  
  d3.select('#svg-histo').selectAll('*').remove();
  var svg = d3.select('#col-right')
    .append('svg')
      .attr('id', 'svg-histo')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');
  
  // 101 elements to include 0 (0.0) and 100 (1.0)
  var groups = Array.from({length: 101}, (x, i) => String(i / 100))
  // Histogram
  for (var i in data.scores) {
    data.scores[i].histScore = Math.round(
        data.scores[i].score*100
      ) / 100;
  }
  
  // Unique selected grouping (species/genus/...)
  var subgroups = getSubgroups(data);
  
  // max number per histogram
  var max_num = 0;
  var bins = {};
  var regroupedData = [];
  for (var i in data.scores) {
    var h = data.scores[i].histScore; 
    var s = data.scores[i][selected]; // selected: "species", "genus", ...
    try {
      if (bins[h])
        bins[h] += 1;
      else
        bins[h] = 1;
    } catch(e) {
      bins[h] = 1;
    }
    if (bins[h] > max_num) {
      max_num = bins[h];
    }
    try {
      if (regroupedData[h][s])
        regroupedData[h][s] += 1;
      else
        regroupedData[h][s] = 1;
    } catch(e) {
      try {
        regroupedData[h][s] = 1;
      } catch(e) {
        regroupedData[h] = {group: String(h)};
        regroupedData[h][s] = 1;
      }
    }
  }
  for (var i in regroupedData) { // set subgroup to 0 where not present
    for (var j in subgroups) {
      var s = subgroups[j];
      if (!regroupedData[i][s]) {
        regroupedData[i][s] = 0;
      }
    }
  }
  var rg = [];
  for (var i in regroupedData) {
    rg.push(regroupedData[i]);
  }
  regroupedData = rg;
  
  var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.0])
    //~ .padding([0.2])
  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(
      d3.axisBottom(x)
        .tickValues(Array.from({length: 11}, (x, i) => i / 10))
    );
  // Y axis
  var y = d3.scaleLinear()
    .domain([0, max_num])
    .range([ height, 0 ]);
  svg.append('g')
    .call(d3.axisLeft(y));
    
  var colorBand = d3.scaleBand().domain(subgroups).range([0, 1]);
  var color = d3.scaleSequential(function(t) {
    return d3.interpolateRainbow(t);
  });
  
  // stack per subgroup
  var stackedData = d3.stack().keys(subgroups)(regroupedData);
  //~ console.log('sd', stackedData);
  
  // Show bars
  svg.append('g')
    .selectAll('g')
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append('g')
      .attr('fill', function(d) { return color(colorBand(d.key));})
      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) { return d; })
      .enter().append('rect')
        .attr('fill', function(d) { return color(d.key); })
        .attr('x', function(d) { return x(d.data.group); })
        .attr('y', function(d) { return y(d[1]); })
        .attr('height', function(d) { return y(d[0]) - y(d[1]); })
        .attr('width', x.bandwidth());
  
  // X
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 4) + ")")
    .style("text-anchor", "middle")
    .text("Cosine similarity");
  // Y
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of samples");
}
var mirror = {
  svg: null
}
var allStrains = {};
var preprocessed = {
  count: 0,
  total: 0,
  items: {},
  library: null,
  ip: null,
  search_library: null,
  cosine_count: 0,
  cosine_total: 0,
  collapsed_data: {}
}
function sp(el) {
  //makeChartBtm
  var id = el.getAttribute('data-id').trim().replace(/\s/g, '');
  var data = allStrains[id];
  //~ d3.select(id).style('visibility', 'visible');
  d3.select('#mirror-title').text(el.getAttribute('data-id'));
  makeChartBtm(data)
}
function dendro(data) {
  // https://observablehq.com/d/549aadb082566173
  
  // Unique selected grouping (species/genus/...)
  var subgroups = getSubgroups(data);
  console.log('subgroups', subgroups);
  
  var selected = document.getElementById('select-histo').selected;
  
  //var s = data.scores[i][selected]
  //var selected = document.getElementById('select-histo').selected;
  
  var width = 954
  var outerRadius = 477
  var innerRadius = 307
  var legend = svg => {
    const g = svg
      .selectAll('g')
      .data(subgroups)
      //~ .data(color.domain())
      .join('g')
      .attr('transform',
        (d, i) => `translate(${-outerRadius},${-outerRadius + i * 20})`
      );

    g.append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', color);

    g.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '0.35em')
      .text(d => d);
  }
  function linkStep(startAngle, startRadius, endAngle, endRadius) {
    const c0 = Math.cos(startAngle = (startAngle - 90) / 180 * Math.PI);
    const s0 = Math.sin(startAngle);
    const c1 = Math.cos(endAngle = (endAngle - 90) / 180 * Math.PI);
    const s1 = Math.sin(endAngle);
    return 'M' + startRadius * c0 + ',' + startRadius * s0 +
      (
        endAngle === startAngle ? '' :
        'A' + startRadius + ',' + startRadius + ' 0 0 ' + 
        (endAngle > startAngle ? 1 : 0) + ' ' + startRadius * c1 + ','
        + startRadius * s1
      )
      + 'L' + endRadius * c1 + ',' + endRadius * s1;
  }
  function linkExtensionConstant(d) {
    return linkStep(d.target.x, d.target.y, d.target.x, innerRadius);
  }
  function linkExtensionVariable(d) {
    return linkStep(d.target.x, d.target.radius, d.target.x, innerRadius);
  }
  function linkConstant(d) {
    return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
  }
  function linkVariable(d) {
    return linkStep(d.source.x, d.source.radius, d.target.x, d.target.radius);
  }
  // Gets the name using the index and selected taxonmy
  function getName(idx) {
    // idx: An index (e.g. 1-448) or "[ Unknown sample ]"
    return (idx == '[ Unknown sample ]') ? '[ Unknown sample ]' :
      data.ids[selected][parseInt(idx)];
  }
  
  // Set the color of each node by recursively inheriting.
  function setColor(d) {
    var name = getName(d.data.name);
    d.color = color.domain().indexOf(name) >= 0 ? color(name) : (d.parent ? d.parent.color : null);
    if (d.children) d.children.forEach(setColor);
  }
  // Set the radius of each node by recursively summing and scaling the distance from the root.
  function setRadius(d, y0, k) {
    d.radius = (y0 += d.data.height) * k;
    if (d.children) d.children.forEach(d => setRadius(d, y0, k));
  }
  // Compute the maximum cumulative length of any node in the tree.
  function maxLength(d) {
    return d.data.height + (d.children ? d3.max(d.children, maxLength) : 0);
  }
  function setTx(d) {
    d.tx = getName(d.data.name);
    if (d.children) d.children.forEach(d => setTx(d));
  }
  
  //~ var chart = function() {
  function chart(chartData) {
    const root = d3.hierarchy(
        chartData, d => d.branchset
      )
      //~ .sum(d => d.branchset ? 0 : 1)
      //~ .sort((a, b) => (a.value - b.value) || d3.ascending(a.data.height, b.data.height));

    cluster(root);
    setRadius(root, root.data.height = 0, innerRadius / maxLength(root));
    setColor(root);
    setTx(root);
    //~ console.log('root', root);
    
    //~ $('#dendro-viz').css('display', 'block');
    //~ $('#dendro-viz').css('display', 'block');
    d3.select('#dendro-viz').selectAll('*').remove();
    const svg = d3.select('#dendro-viz').append('svg')
      .attr('viewBox', [-outerRadius, -outerRadius, width, width])
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .call(d3.zoom().on('zoom', function (event, d) {
         svg.attr('transform', event.transform)
      }));
    
    svg.append('g')
      .call(legend);
    
    svg.append('style').text(`
      .link--active {
        stroke: #000 !important;
        stroke-width: 1.5px;
      }
      .link-extension--active {
        stroke-opacity: .6;
      }
      .label--active {
        font-weight: bold;
      }
    `);
    
    const linkExtension = svg
      .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0.25)
      .selectAll('path')
      .data(root.links().filter(d => !d.target.children))
      .join('path')
        .each(function(d) { d.target.linkExtensionNode = this; })
        .attr('d', linkExtensionConstant)//
        .attr('stroke', d => d.target.color);

    const link = svg
      .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#000')
      .selectAll('path')
      .data(root.links())
      .join('path')
        .each(function(d) { d.target.linkNode = this; })
        .attr('d', linkConstant)
        .attr('stroke', d => d.target.color);

    svg.append('g')
      .selectAll('text')
      .data(root.leaves())
      .join('text')
        .attr('dy', '.31em')
        .attr('transform', d => 
          `rotate(${d.x - 90}) translate(${innerRadius + 4},0)${d.x < 180 ? '' : ' rotate(180)'}`
        )
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .text(function(d) { return getName(d.data.name); })
        .attr('txCategory', function(d) { return getName(d.data.name); })
        .classed('cls-dendro-labels', true)
        //~ .classed(getName(d.data.name), true)
        //~ .classed(function(d) { return 'cls-' + getName(d.data.name); }, true)
        //~ .text(d => d.data.name.replace(/_/g, ' '))
        .on('mouseover', mouseovered(true))
        .on('mouseout', mouseovered(false));
    
    //~ d3.selectAll('.cls-dendro-labels').
    
    function update(checked) {
      const t = d3.transition().duration(750);
      linkExtension.transition(t).attr('d',
        checked ? linkExtensionVariable : linkExtensionConstant);
      link.transition(t).attr('d',
        checked ? linkVariable : linkConstant);
    }

    function mouseovered(active) {
      return function(event, d) {
        d3.select(this).classed('label--active', active);
        d3.select(d.linkExtensionNode)
          .classed('link-extension--active', active).raise();
        
        // updates all other categories that are same as this
        var a = d3.select(this).attr('txCategory');
        $("text[txCategory='" + a + "']").toggleClass('link--active', active);
        
        do d3.select(d.linkNode).classed('link--active', active).raise();
        while (d = d.parent);
      };
    }

    return Object.assign(svg.node(), {update});
  }
  
  var colorBand = d3.scaleBand().domain(subgroups).range([0, 1]);
  var color = d3.scaleSequential(function(t) {
    return d3.interpolateRainbow(t);
  })
  
  ///.domain(subgroups)
  
  //~ color(colorBand('Bacilli'));
  //~ []
  
  
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeCategory10)
    
  //~ var color = d3.scaleOrdinal()
    //~ .domain(['Bacteria', 'Eukaryota', 'Archaea'])
    //~ .range(d3.schemeCategory10)
    
  var cluster = d3.cluster()
    .size([360, innerRadius])
    .separation((a, b) => 1);
  
  //var update = chart.update(false); //showLength
  var x = chart(data.tree);
  //console.log(x);
  //document.body.appendChild(x);
  x.update(true);
  $('#dendro-viz-toggle input')[0].chart = x;
}
socket.onmessage = function(e) {
  console.log(e);
  var data = JSON.parse(e.data).data;
  console.log(data);
  //~ console.log(data.ip);
  
  try {
    if (data.ip) {
      preprocessed.ip = data.ip;
    }
  } catch (e) {
    console.log(e);
  }
  //~ var data = JSON.parse(JSON.parse(e.data));
  //~ console.log(data);
  
  if (data.message == 'completed preprocessing') {
    var c = data.count;
    preprocessed.items[c] = true;
    preprocessed.count++;
    $('#filetable-preprocess' + c).text('done');
    //~ $('#stat-complete').text(preprocessed.count)
    $('#stat-complete').text(
      preprocessed.count + '/' + preprocessed.total + ' completed');
    // Check if all are done...
    // If all are done, then do collapseLibrary
    if (preprocessed.count == preprocessed.total) {
      $('#stat-title').text('Collapsing library entries');
      $('#stat-complete').text('');
      // socket send
      socket.send(JSON.stringify({
        collapseLibrary: preprocessed.library,
        searchLibrary: preprocessed.search_library
      }));
    }
    
  } else if (data.message == 'completed collapsing') {
    // show next tab: search type
    // choose 
    //$nss-card-2
    $('#nss-1').removeClass('active');
    $('#nss-2').addClass('active');
    $('#nss-2').css('display', 'block');
    
    $('#nss-card-1').css('display', 'none');
    $('#nss-card-2').css('display', 'block');
    
    var t = $('#file-listing2').DataTable({
      data: data.data.results,
      columns: [
        {data: 'id', title: 'ID'},
        {data: 'strain_id', title: 'Strain ID'},
        {data: 'strain_id__strain_id', title: 'Strain Name'},
        {data: 'id', title: 'Top scores (Strain, Genus / Species)',
          render: function(data, type) {
            // e.g. top-scores-8373
            return '<table id="top-scores-'+data+'" style=""></table>'; //width: 500px;white-space: pre-line;
          }
        },
        {data: 'id', title: '',
          render: function(data, type) {
            return '<a href="#" onclick="javascript:singleScore(' + data + ')">Explore more</a>';
          }
        }
      ]
    });
    t.draw();
    // Update total count
    preprocessed.cosine_total = data.data.results.length;
    $('#stat2-complete').text(
      '0 / ' + preprocessed.cosine_total + ' completed'
    );
    
  } else if (data.message == 'completed cosine') {
    // Shows an individual collapsed spectra cosine similarity result
    
    preprocessed.cosine_count++;
    $('#stat2-complete').text(
      preprocessed.cosine_count + ' / ' + preprocessed.cosine_total +
      ' completed'
    );
    if (preprocessed.cosine_count == preprocessed.cosine_total) {
      $('#cosine-status').css('display', 'none');
    }
    
    // Stores by collapsed spectra id
    preprocessed.collapsed_data[data.data.spectra1] = 
      data.data.result;
    //~ console.log(preprocessed.collapsed_data);
    //~ for (var i in data.data.results) {
      //~ var x = data.data.results[i];
      //~ preprocessed.collapsed_data[x.id] = data.data.results[i];
    //~ }
    
    var x = data.data.result.scores;
    var output = [];
    for (var i=0; i<4; i++) {
      output.push(x[i]);
    }
    
    var t = $('#top-scores-'+data.data.spectra1).DataTable({
      data: output,
      paging: false,
      searching: false,
      ordering: false,
      info: false,
      columns: [
        {data: 'score', title: ''},
        {data: 'strain', title: ''},
        {data: 'genus', title: ''},
        {data: 'species', title: ''},
      ]
    });
    t.order([0, 'desc']) // reorders in correct direction
      .draw();
  }
  
  return;
}
socket.onclose = function(e){
  console.log(e);
}

function singleScore(id) {
  var data = preprocessed.collapsed_data[id];
  
  // Unique selected grouping (species/genus/...)
  //~ var x = d3.map(data.scores, function(d) {
    //~ return d[selected];
    //~ return (d[selected])
  //~ });
  //~ data.subgroups = [...new Set(x)]; // spread operator
  
  $('#nss-1').removeClass('active');
  $('#nss-2').removeClass('active');
  $('#nss-3').addClass('active');
  $('#nss-3').css('display', 'block');
  
  $('#nss-card-1').css('display', 'none');
  $('#nss-card-2').css('display', 'none');
  $('#nss-card-3').css('display', 'block');
  
  //~ $('#data-table').text(''); // clear if any
  
  var t = $('#data-table').DataTable({
    data: data.scores,
    destroy: true, // https://datatables.net/manual/tech-notes/3
    //~ data: result,
    columns: [
      {data: 'score', title: 'Score'},
      {data: 'strain', title: 'Strain',
        render: function(data, type) {
          return '<span style="color:steelblue;font-weight:400;cursor:pointer;" data-id="'+data+'" onclick="sp(this);">'
            + data + '</span>';
        }
      },
      {data: 'kingdom', title: 'Kingdom'},
      {data: 'phylum', title: 'Phylum'},
      {data: 'class', title: 'Class'},
      {data: 'order', title: 'Order'},
      {data: 'genus', title: 'Genus'},
      {data: 'species', title: 'Species'},
    ]
  });
  t.order([0, 'desc']) // reorder in correct direction
    .draw();
  
  // d3 stacked bar
  // https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
  // set the dimensions and margins of the graph
  $('#col-left').removeClass('col-12');
  $('#col-right').removeClass('col-0');
  $('#col-left').addClass('col-8');
  $('#col-right').addClass('col-4');
  if (!$('#select-histo').length) {
    d3.select('#col-right')
      .append('select')
      .attr('id', 'select-histo')
      .selectAll('option')
      .data(['Kingdom', 'Phylum', 'Class', 'Order', 'Genus', 'Species'])
      .enter()
      .append('option')
      .attr('value', function (d) { return d; })
      .text(function (d) { return d;});
  }  

  var s = document.getElementById('select-histo');
  s.data = data;
  s.selected = s.options[s.selectedIndex].value.toLowerCase();
  drawHisto();
  s.onchange = function() {
    this.selected = this.options[this.selectedIndex].value.toLowerCase();
    drawHisto();
    dendro(this.data);
  }
  
  // d3 line graph
  // e.g. https://www.d3-graph-gallery.com/graph/line_basic.html
  // col-left, col-right
  // e.g. https://www.d3-graph-gallery.com/graph/scatter_basic.html
  //~ $('#col-left').removeClass('col-12');
  //~ $('#col-right').removeClass('col-0');
  //~ $('#col-left').addClass('col-6');
  //~ document.getElementById('spectra-viz').style.display = 'block';
  document.getElementById('container-dendro').style.display = 'block';
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  
  d3.select('#spectra-viz').selectAll('*').remove();
  var svg = d3.select('#spectra-viz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .call(d3.zoom().on('zoom', function (event, d) {
       svg.attr('transform', event.transform)
    }))
    .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');
  // tooltip
  var tooltip = d3.select('body')
    .append('div')
    .style('opacity', 0)
    //~ .attr('class', 'tooltip')
    .style('background-color', 'lightsteelblue')
    .style('border', 'solid')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px')
    .style('position', 'absolute')
    .style('text-align', 'center')
    .style('width', '160px')
    .style('height', '40px');
    
  // X axis
  //~ var x = d3.scaleBand()
    //~ .domain([1900, 17000])
    //~ .range([0, width])
    //~ .padding([0.0])
  var x = d3.scaleLinear()
    .domain([1900, 17000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  // Y axis, max absolute is 100
  var y = d3.scaleLinear()
    .domain([-100, 100])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));
  var yTop = d3.scaleLinear()
    .domain([0, 100])
    .range([0, height/2]);
  //~ var yBtm = d3.scaleLinear()
    //~ .domain([0, 100])
    //~ .range([0, height/2]);
  svg.append('text')
    .text('')
    .attr('x', 0)
    .attr('y', 4)
    .attr('id', 'mirror-title')
  mirror.x = x;
  mirror.y = y;
  mirror.yTop = yTop;
  mirror.height = height;
  mirror.x_peaks = {};
  // reshape original
  //~ var p1 = data.original.peak_mass.split(',');
  //~ var p2 = data.original.peak_intensity.split(',');
  var p1 = data.original.binned_mass;//.split(',');
  var p2 = data.original.binned_intensity;//.split(',');
  var px = [];
  for (var i in p1) {
    px.push({x: p1[i], y: p2[i]});
  }
  svg.append('g').selectAll('rect').data(px).enter()
    .append('rect')
    .attr('fill', function(d) { return '#000000'; })
    .attr('x', function(d) { return x(d.x); })
    .attr('y', function(d) { return (height/2) - yTop(d.y); }) // rather than middle (height/2)
    .attr('height', function(d) { return yTop(d.y); })
    .attr('width', 0.2);
  // mirror original x, for matching
  for (var i in p1) {
    //~ var x = Math.round(parseFloat(p1[i]));// / 1; // zero digit
    //~ mirror.x_peaks[x] = true; 
    mirror.x_peaks[p1[i]] = true; // e.g. 100.2
  }
  svg.append('g').attr('id', 'mirror-btm');
    
  // Makes an allStrains object for later use
  data.scores.forEach(function(dx) {
    allStrains[dx.strain.trim().replace(/\s/g, '')] = dx;
  });
  
  // Dendrogram
  /* merges: "an (n-1) by 2 matrix. Row (i) of merge describes the
  merging of clusters at step (i) of the clustering. If an element (j)
  in the row is negative, then observation (-j) was merged at this
  stage. If (j) is positive then the merge was with the cluster formed
  at the (earlier) stage (j) of the algorithm. Thus negative entries
  in merge indicate agglomerations of singletons, and positive entries
  indicate agglomerations of non-singletons."
  */
  //~ console.log('dendro', JSON.parse(data.data.dendro));
  //~ console.log('dendro2', JSON.parse(data.data.dendro2));
  var x = JSON.parse(data.dendro);
  //~ var x = JSON.parse(data.data.dendro);
  //~ var x = JSON.parse(data.data.dendro2);
  function parseTree(node) {
    var leaf = {
      name: 'zzz',
      height: node.plotHeight[0],
      branchset: []
    }
    if (node['1']) { // 2 branches
      leaf.branchset.push(parseTree(node['1']));
    }
    if (node['2']) { // 1-2 branches
      leaf.branchset.push(parseTree(node['2']));
      for (var i in node) {
        if (i.indexOf('peaks') === 0) { // 1 leaf, 1 branch
          var x = /peaks(\d+)/.exec(i);
          //~ x = (x) ? pidx[x[1]] : '[ Unknown sample ]'; // unknown node is "peaks"
          x = (x) ? x[1] : '[ Unknown sample ]'; // unknown node is "peaks"
          leaf.branchset.push({
            name: x,
            height: node[i].plotHeight[0],
          });
          
          break;
        }
      }
    } else { // 2 leaves
      for (var i in node) {
        if (i.indexOf('peaks') === 0) {
          var x = /peaks(\d+)/.exec(i);
          //~ x = (x) ? pidx[x[1]] : '[ Unknown sample ]'; // unknown node is "peaks"
          x = (x) ? x[1] : '[ Unknown sample ]'; // unknown node is "peaks"
          leaf.branchset.push({
            name: x,
            height: node[i].plotHeight[0],
          });
        }
      }
    }
    return leaf;
  }
  //~ /////// data.ids[ ... ];
  //~ var strain_ids = data.strain_ids;
  //~ var species = data.strain_id__cSpecies;
  //~ var genus = data.strain_id__cGenus;
  //~ var pidx = {};
  //~ for (var i in species) { // i=0
    //~ pidx[String(i)] = genus[i];
  //~ }
  data.tree = parseTree(x);
  //~ var v = {
    //~ branchset: [v],
    //~ name: '---',
    //~ height: 0
  //~ }
  console.log(data.tree);
  dendro(data);
}

function makeChartBtm(dx) {
  var g = d3.select('#mirror-btm');
  g.selectAll('*').remove();
  
  var color = function(x) {
    //~ x = Math.round(parseFloat(x));// / 1; // zero digit
    //~ return (mirror.x_peaks[x]) ? '#0000ff' : '#000000';
    return (mirror.x_peaks[x]) ? '#0000ff' : '#000000';
  }
  //allStrains.push(dx.strain.trim().replace(/\s/g, ''));
  // e.g. 100 peaks per sample
  //~ var p1 = dx.peak_mass.split(',');
  //~ var p2 = dx.peak_intensity.split(',');
  var p1 = dx.binned_mass;//.split(',');
  var p2 = dx.binned_intensity;//.split(',');
  var px = [];
  for (var i in p1) {
    px.push({x: p1[i], y: p2[i]});
  }
  g.selectAll('rect').data(px).enter()
    .append('rect')
    .attr('fill', function(d) { return color(d.x); })
    .attr('x', function(d) { return mirror.x(d.x); })
    .attr('y', function(d) { return (mirror.height/2); }) // rather than bottom
    .attr('height', function(d) { return mirror.yTop(d.y); })
    .attr('width', 0.2);
    
  //~ svg.append("path")
    //~ .datum(px)
    //~ .attr("fill", "none")
    //~ .attr("stroke", "steelblue")
    //~ .attr("stroke-width", 1)
    //~ .attr('id', function(d) {return 'path-strain-' + d.strain;})
    //~ .style('visibility', 'hidden')
    //~ .attr("d", d3.line()
      //~ .x(function(d) { return x(d.x) })
      //~ .y(function(d) { return y(d.y) })
    //~ )
}
function makeChart(el, dataXY) {
    
    // Data parsing
    // Quit on error
    try {
      var xyd = JSON.parse(dataXY);
      
      var xd = xyd.mass;
      var yd = xyd.intensity;
    } catch(e) {
      return;
    }
    
    var d = []; // An array of arrays.
    for (var i in xd) {
      d.push([xd[i], yd[i]]);
    }
    
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 20, bottom: 60, left: 60};
    var width  = 460 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    //var barWidth = 2, barOffset = 1;
    
    // Create scale
    var sx = d3.scaleLinear()
                .domain([0, d3.max(xd)])
                .range([0, width]);
    var sy = d3.scaleLinear()
                .domain([0, d3.max(yd)])
                .range([height, 0]);
    // Add scales to axis
    var x_axis = d3.axisBottom().scale(sx);
    var y_axis = d3.axisLeft()  .scale(sy);
    
    // append the svg object to the body of the page
    var svg = //d3.select("#my_dataviz")
      d3.select(el)
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        //
          
    
    //Append group and insert axis
    svg
      .append("g")
      .attr("transform", "translate(0, "+height+")")
      .call(x_axis);
    svg.append("g").call(y_axis);
    
    // set the ranges
    var x = d3.scaleLinear()
      .range([0, width])
      .domain([0, d3.max(xd, function(d) { return d; })]);
      //.padding(0.1);
    var y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(yd, function(d) { return d; })]);
      
    //~ x.domain(xd.map(function(d) { return d; }));
    //~ x;
    //~ y;

    //~ var borderPath = svg.append("rect")
      //~ .attr("x", 0)
      //~ .attr("y", 0)
      //~ .attr("height", height)
      //~ .attr("width", width)
      //~ .style("stroke", 'black')
      //~ .style("fill", "none")
      //~ .style("stroke-width", 1);
    
    svg.selectAll(".bar")
      .data(d)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", 2)//x.bandwidth())
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return height - y(d[1]); });
    
    // axis titles
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width/2)
      .attr("y", height + 40)
      .text("M/Z");
    
    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", -height/2)
      .attr("y", -30)
      //~ .attr("y", 0)
      //~ .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("Intensity");
      
      //~ .attr("cx", function(d) {
        //~ return d[0];
      //~ })
      //~ .attr("cy", function(d) {
        //~ return d[1];
      //~ })
      //~ .attr("r", function(d) {
        //~ //return Math.sqrt(h - d[1]);
        //~ return 1;
      //~ })
      //~ .attr("fill", "#00aa88");
  }
  
// upload form
function upload(event) {
  $('#upload-button')[0].disabled = true;
  var form = new FormData(this);
  
  console.log(new FormData(this));
  console.log(new FormData(this).values());
  console.log($('#customFile')[0].files);
  console.log($('#customFile')[0].files[0]);
  
  // Shows overall status
  preprocessed.total = $('#customFile')[0].files.length;
  $('#stat-complete').text('0/' + preprocessed.total + ' completed');
  $('#preprocess-upload-status').css('display', 'block');
  
  preprocessed.search_library = form.get('search_library');
  
  // first create library or validate existing library
  // then loop through files and add them individually.
  ajaxLibrary(this);
  
  event.preventDefault();
}
function ajaxLibrary(form) {
  
  $.ajax({
    xhr: function() {
     var xhr = new window.XMLHttpRequest();
     return xhr;
    },
    
    dataType: 'JSON',
    data: new FormData(form),
    url: formURLs.library,
    type: 'POST',
    processData: false,
    contentType: false,
    // on success
    success: function(response) {
      console.log(response);
      //~ var r = JSON.parse(response.responseJSON);
      var library = response.data.library;
      preprocessed.library = library;
      preprocessed.search_library = response.data.search_library;
      
      // Loop through upload files and start each one
      //~ $.each($('#customFile')[0].files, function() {
        
      //~ }
      for (var i=0; i<$('#customFile')[0].files.length; i++) {
        preprocessed.items[i] = false;
        var f = new FormData(form);
        f.set('file', $('#customFile')[0].files[i]);
        f.set('tmp_library', library);
        f.set('upload_count', i);
        f.set('ip', preprocessed.ip);
        //~ f.set('search_library', f.get());
        uploadHelper(f);
      }
    },
    // on error
    error: function(response) {
      console.log(response);
      var r = JSON.parse(response.responseJSON.errors);
      console.log(r);
      try {
        if (r.__all__.length > 0) {
          for (var i in r.__all__) {
            if (r.__all__[i].message == 'Library title already exists!') {
              $('#id_library_create_new').removeClass('is-valid').addClass('is-invalid');
              $('#new-library-error').removeClass('toggle-display')
                .text('Library title already exists!')
            }
          }
        }
      } catch(e) {
        
      }
    }
  });
}

function uploadHelper(formData) {
  //~ return;
  
  // Modal tempalte adapted from
  // https://github.com/jakobadam/bootstrap-uploadprogress
  //~ var template = '<div class="modal fade" id="file-progress-modal">\
  //~ <div class="modal-dialog">\
    //~ <div class="modal-content">\
      //~ <div class="modal-header">\
        //~ <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
        //~ <span aria-hidden="true">&times;</span></button>\
        //~ <h4 class="modal-title">Uploading</h4>\
      //~ </div>\
      //~ <div class="modal-body">\
        //~ <div class="modal-message"></div>\
        //~ <div class="progress">\
          //~ <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0"\
               //~ aria-valuemax="100" style="width: 0%;min-width: 2em;">\
            //~ 0%\
          //~ </div>\
        //~ </div>\
      //~ </div>\
      //~ <div class="modal-footer" style="display:none">\
        //~ <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
      //~ </div>\
    //~ </div>\
  //~ </div>\
//~ </div>';
  
  var template = '\
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0"\
         aria-valuemax="100" style="width: 0%;min-width: 2em;">\
      0%\
    </div>';
          
  var t = $(template);
  //~ t.modal({
    //~ backdrop: 'static',
    //~ keyboard: false
  //~ });
  //~ t.message = t.find('.modal-message');
  //~ t.title = t.find('.modal-title');
    //~ //this.$modal_footer = this.$modal.find('.modal-footer');
  var n = $('#filetable-upload' + formData.get('upload_count'));
  $('#filetable-upload' + formData.get('upload_count')).append(t);
  t.progress = n.find('.progress-bar');
  
  $.ajax({
    xhr: function() {
      var xhr = new window.XMLHttpRequest();

      // Upload, filetable-upload{i}
      xhr.upload.addEventListener('progress', function(evt){
        if (evt.lengthComputable) {
          var pct = Math.round(100 * evt.loaded / evt.total);
          // filetable-upload
          t.progress.attr('aria-valuenow', pct);
          t.progress.text(pct + '%');
          t.progress.css('width', pct + '%');
        }
      }, false);

      // Download
      //~ xhr.addEventListener('progress', function(evt){
        //~ if (evt.lengthComputable) {
          //~ var percentComplete = evt.loaded / evt.total;
        //~ }
      //~ }, false);

      return xhr;
    },
    
    dataType: 'JSON',
    data: formData,
    sequentialUploads: true,
    url: formURLs.files,
    type: 'POST',
    processData: false,
    contentType: false,
    // on success
    success: function(response) {
      console.log(response);
      //~ t.modal('hide');
      
      if (response.status == 'preprocessing') {
        //~ t.title.text('Preprocessing');
        //~ t.progress.text('0%');
      }
    },
    
    // on error
    error: function(response) {
      console.log(response);
      //~ t.modal('hide');
      $('#upload-button')[0].disabled = false;
      try {
        var r = JSON.parse(response.responseJSON.errors);
        console.log(r);
        if (r.file) { // array of messages
          $('#customFile').removeClass('is-valid').addClass('is-invalid');
          $('#file-error').removeClass('toggle-display').text(
            r.file.join('<br>')
          );
          var msgs = [];
          r.file.forEach(e => msgs.push(e.message));
          $('#file-error').text(msgs.join('<br>'));
        } else if (r.__all__.length > 0) {
          for (var i in r.__all__) {
            if (r.__all__[i].message == 'Library title already exists!') {
              $('#id_library_create_new').removeClass('is-valid').addClass('is-invalid');
              $('#new-library-error').removeClass('toggle-display')
                .text('Library title already exists!')
            }
          }
        }
      } catch(e) {
        console.log(e);
      }
      
    }
  });
  return false;
}
import getaccesstoken2ledgged from "./2leggedAccessToken";

/* global Autodesk, THREE */
var viewer;
var forgeNamesArray = new Array();
var nameToAmountMap = new Map();
var is_GEOMETRY_LOADED_EVENT = false
var is_OBJECT_TREE_CREATED_EVENT = false
var clamp_range = []
var nameToAmountMap = new Map();
var min = ''
var max = ''
let THREE_color_array = [new THREE.Vector4(66/255,165/255,0,0.9),
new THREE.Vector4(145/255,197/255,0,0.9),
new THREE.Vector4(252/255, 226/255, 42/255,0.9),
// new THREE.Vector4(255/255,113/255,0,0.9),//orange
// new THREE.Vector4(255/255,18/255,0,0.9) //red
new THREE.Vector4(255 / 255, 0, 0, 0.9),
new THREE.Vector4(255 / 255, 0, 0, 0.9)
]
export var properties = {};
function end_viewer() {
  if (viewer) {
    viewer.finish();
    viewer = null;
    Autodesk.Viewing.shutdown();
  }
}

function get_three_color(clamp_value)
{
    let three_color_index = 0
    for( let i=1; i<clamp_range.length;i++)
    {
        if(clamp_value<=clamp_range[i])
        {
          //  console.log(`clampvalue ${clamp_value} index is ${i}. clamp_range is [${clamp_range}]`);
            return THREE_color_array[three_color_index]
        }
        // if(clamp_value==clamp_range[i])
        // {
        //     console.log(`clampvalue ${clamp_value} index is ${i}. clamp_range is [${clamp_range}]`);
        //     return THREE_color_array[three_color_index]
        // }
        three_color_index ++
    }

}
function updateHeatmapLegend() {
  const heatmapColorsDiv = document.getElementById("heatmap-colors");

  if (!heatmapColorsDiv) return;

  // Clear existing legend items
  heatmapColorsDiv.innerHTML = "";

  // Create legend items
  for (let i = 0; i < clamp_range.length - 1; i++) {
    const color = THREE_color_array[i];
    const rangeText = `${clamp_range[i].toFixed(2)} - ${clamp_range[i + 1].toFixed(2)}`;

    // Create a legend item
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "5px";

    // Add color box
    const colorBox = document.createElement("div");
    colorBox.style.width = "20px";
    colorBox.style.height = "20px";
    colorBox.style.backgroundColor = `rgba(${Math.round(color.x * 255)}, ${Math.round(color.y * 255)}, ${Math.round(color.z * 255)}, ${color.w})`;
    colorBox.style.marginRight = "10px";

    // Add range text
    const rangeLabel = document.createElement("span");
    rangeLabel.textContent = rangeText;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(rangeLabel);

    // Append legend item to the heatmapColorsDiv
    heatmapColorsDiv.appendChild(legendItem);
  }
}

function set_vector4_color_array(min,max)
{
    let part_value = (max - min)/ 4
    for (let i = 0; i<5;i++)
    {
        if(i===0){
        clamp_range[i] = min}
        else
        {
            clamp_range[i] = clamp_range[i-1] + part_value
        }
    }
    console.log('clamp range in heatmap helper ',clamp_range);
}

async function launchViewer(div, urn, _2legged = false) {
  //Get Forge access token
  //let acess_token =  await getaccesstoken2ledgged()
  // if (_2legged === true)
  //   {
  var acess_token = await getaccesstoken2ledgged();
  // }
  // else{
  //   var acess_token = sessionStorage.getItem('acess_token_3_legged')
  // }
  var av = Autodesk.Viewing;
  var options = {
    document: urn,
    env: "AutodeskProduction",
    api: "derivativeV2",
    accessToken: acess_token,
  };
  console.log("options", options);

  var viewerElement = document.getElementById(div);

  viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, {});

  Autodesk.Viewing.Initializer(options, function () {
    const startedCode = viewer.start();
    if (startedCode > 0) {
      console.error("Failed to create a Viewer: WebGL not supported.");
      return;
    }
    viewer.addEventListener(av.GEOMETRY_LOADED_EVENT, onModelLoadedFronInit, {
      once: true,
    });
    viewer.addEventListener(
      av.OBJECT_TREE_CREATED_EVENT,
      (model) => {
        is_OBJECT_TREE_CREATED_EVENT = true;
        // console.log('===>>',is_GEOMETRY_LOADED_EVENT,is_OBJECT_TREE_CREATED_EVENT);
        if (is_GEOMETRY_LOADED_EVENT) {
          alert("gerpm load ", is_GEOMETRY_LOADED_EVENT);
          loadModel(viewer, urn);
        }
      },
      {
        once: true,
      }
    );
    loadModel(viewer, urn);
    // loadDocument(options.document);
  });
  function loadModel(viewer, documentId) {
    Autodesk.Viewing.Document.load(
      documentId,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
    // viewer.setLightPreset(16);
    function onDocumentLoadSuccess(viewerDocument) {
      var defaultModel = viewerDocument.getRoot().getDefaultGeometry(true);
      if (viewer) viewer.loadDocumentNode(viewerDocument, defaultModel);
    }

    function onDocumentLoadFailure() {
      console.error("Failed fetching Forge manifest");
    }
  }

  async function onModelLoadedFronInit(data) {
    nameToAmountMap.set("3659", 427863.85);
    nameToAmountMap.set("3660", 536140.89);
    nameToAmountMap.set("3665", 536140.89);
    nameToAmountMap.set("3666", 441522.74);
    nameToAmountMap.set("3673", 364642.58);
    nameToAmountMap.set("3686", 1376.66);
    min = Math.min(...nameToAmountMap.values());
    max = Math.max(...nameToAmountMap.values());
    set_vector4_color_array(min, max);
    // updateHeatmapLegend();
    //alert(is_OBJECT_TREE_CREATED_EVENT)
    if (is_OBJECT_TREE_CREATED_EVENT) loadModel(viewer, urn);
    var viewer = data.target;
    viewer.setEnvMapBackground(false);
    const tree = viewer.model.getInstanceTree();
    const rootId = tree.getRootId();
    var rootName = tree.getNodeName(rootId);
    var parent_child_ids = {};

    tree.enumNodeChildren(
      rootId,
      function (dbId) {
        var childCount = tree.getChildCount(dbId);
        if (nameToAmountMap.has(dbId.toString())) {
          var parentId = tree.getNodeParentId(dbId);
          var parentName = tree.getNodeName(parentId);
          var nodeName = tree.getNodeName(dbId);
          parent_child_ids[dbId] = parentId;
          var name = tree.getNodeName(dbId);
          var val = nameToAmountMap.get(dbId.toString());
          forgeNamesArray.push(dbId);
        }
      },
      true
    );
    forgeNamesArray.map((obj) => {
      let obj_id = parent_child_ids[obj];
      let key = parseFloat(nameToAmountMap.get(obj.toString()));
      let clampValue = "45454";
      let color = get_three_color(key);
      viewer.setThemingColor(obj, color);
    });
  }
}

function onDocumentLoadSuccess(viewerDocument) {
  //Loading the Geometry to the viewer.
  var doc = viewerDocument.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(viewerDocument, doc);
}

function onDocumentLoadFailure() {
  console.error("Failed fetching Forge manifest");
}
function loadDocument(documentId) {
  //Loading the document.
  Autodesk.Viewing.Document.load(
    documentId,
    onDocumentLoadSuccess,
    onDocumentLoadFailure
  );
}

const Helpers = {
  launchViewer,
  loadDocument,
  end_viewer,
};

export default Helpers;

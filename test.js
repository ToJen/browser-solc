var exampleSource = `pragma solidity ^0.4.9;

contract WithConstructor {
  uint128 public num = 5;
  address owner;

  // modifier onlyMe() {
  //     if(msg.sender != owner) throw;
  //     _;
  // }

  event NumChanged(address x);

  function WithConstructor(uint128 a, bytes32 br) public {
    // owner = msg.sender;
    num = a;
    // NumChanged(msg.sender);
  }

  function add(uint128 a) public returns (uint128) {
    return num + a;
  }

  function setA(uint128 a) payable public {
    num = a;
    // NumChanged(a);
  }
}`;

var optimize = 1;
var compiler;

function getSourceCode() {
  return document.getElementById("source").value;
}

function getVersion() {
  return document.getElementById("versions").value;
}

function status(txt) {
  document.getElementById("status").innerHTML = txt;
}

function populateVersions(versions) {
  sel = document.getElementById("versions");
  sel.innerHTML = "";

  for (var i = 0; i < versions.length; i++) {
    var opt = document.createElement("option");
    opt.appendChild(document.createTextNode(versions[i]));
    opt.value = versions[i];
    sel.appendChild(opt);
  }
}

function solcCompile(compiler) {
  status("compiling");
  document.getElementById("compile-output").value = "";
  var result = compiler.compile(getSourceCode(), optimize);
  var stringResult = JSON.stringify(result);
  document.getElementById("compile-output").value = stringResult;
  status("Compile Complete.");
}

function loadSolcVersion() {
  status("Loading Solc: " + getVersion());
  AionBrowserSolc.loadVersion("Aion", getVersion(), function(c) {
    compiler = c;
    console.log("Solc Version Loaded: " + getVersion());
    status("Solc loaded.  Compiling...");
    solcCompile(compiler);
  });
}

window.onload = function() {
  document.getElementById("source").value = exampleSource;

  document.getElementById("versions").onchange = loadSolcVersion;

  if (typeof AionBrowserSolc == "undefined") {
    console.log(
      "You have to load browser-solc.js in the page.  We recommend using a <script> tag."
    );
    throw new Error();
  }

  status("Loading Compiler");
  AionBrowserSolc.getVersions(function(soljsonSources, soljsonReleases) {
    populateVersions(soljsonSources);

    document.getElementById("versions").value = soljsonReleases["0.4.5"];

    loadSolcVersion();
  });
};

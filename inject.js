var showDHO = " ";
var showTrip = " ";

const Inject = {
  async init() {
    Inject.cache = {
      resultItemsList: [],
    }
    if (document.querySelector('.resultsHeader') == null) {
      return;
    }
    this.createSearchBar();
    this.paintingRows(0);
  },
  createSearchBar() {
    var resultHeader = document.querySelector('.resultsHeader');
    resultHeader.style.display = "flex";
    resultHeader.style.justifyContent = "space-between";

    var searchBarDom = document.createElement('div');
    searchBarDom.style.display = "flex";

    var DomMinMile = this.createInputDom("minmile", "Min Mile", 'number');
    var DomMaxMile = this.createInputDom("maxmile", "Max Mile", 'number');
    var DomMinOffer = this.createInputDom("minoffer", "Min Offer", 'number');
    var DomBlockcities = this.createInputDom("blockcities", "Block Cities", 'text');
    var DomBlockstates = this.createInputDom("blockstates", "Block States", 'text');
    var DomSubmitBtn = this.createInputDom("filterSubmit", "Filter", 'button');
    DomSubmitBtn.addEventListener('click', this.handleClickFilterBtn);

    searchBarDom.append(DomMinMile);
    searchBarDom.append(DomMaxMile);
    searchBarDom.append(DomMinOffer);
    searchBarDom.append(DomBlockcities);
    searchBarDom.append(DomBlockstates);
    searchBarDom.append(DomSubmitBtn);

    resultHeader.append(searchBarDom)
  },
  createInputDom(inputName, labelName, type) {
    var DomP = document.createElement('div');
    DomP.style.marginLeft = "5px";
    DomP.style.marginRight = "5px";

    var DomInput = document.createElement("input");
    DomInput.type = type;
    DomInput.name = inputName;
    DomInput.style.width = "80px";
    DomInput.style.margin = "2px";
    if (type !== "button") {
      var DomLabel = document.createElement("label");
      DomLabel.innerHTML = labelName;
      DomLabel.for = inputName;
      DomLabel.style.textTransform = "capitalize";
      DomLabel.style.color = "blue";
      DomP.append(DomInput);
      DomP.append(DomLabel);
    } else {
      DomInput.value = labelName;
      DomInput.style.textTransform = "capitalize";
      DomInput.style.color = "blue";
      DomP.append(DomInput);
    }

    return DomP;
  },
  paintingRows(startIndex) {
    var gettingResultItems = setInterval(function () {
      let resultItemsList = document.getElementsByClassName("resultItem");
      if (resultItemsList != null && resultItemsList.length !== 0) {
        Inject.cache.resultItemsList = resultItemsList;
        for (let i = 0; i < resultItemsList.length; i++) {
          let resultItem = resultItemsList[i];
          resultItem.querySelector('.qa-match-row.resultSummary').addEventListener('click', () => {
            Inject.injectRowEvent(resultItem)
          });
          let mailAnchor = resultItem.querySelector('.contact .trackLink');
          let origin = resultItem.querySelector('.origin').innerHTML;
          let dest = resultItem.querySelector('.dest').innerHTML;
          if (mailAnchor !== null) {
            mailAnchor.href = mailAnchor.href + "?subject=" + origin + " to " + dest +
              "&body=Hello, this is _____ from _____________.\n I'm interested in the load going from " + origin + " to " + dest + "."
          }

          let rateStr = (resultItem.querySelector('.rate').innerHTML);
          let tripStr = resultItem.querySelector('.trip>a') !== null ? resultItem.querySelector('.trip>a').innerHTML : "";
          let rate = convertToFloat(rateStr);
          let trip = convertToFloat(tripStr);
          let rpm = rate / trip;
          let resultItemTr = resultItem.querySelector('tr.qa-match-row')
          if (rpm >= 2.5) {
            resultItemTr.style.background = "green";
          } else if ((rpm >= 1.5) && (rpm < 2.5)) {
            resultItemTr.style.background = 'yellow';
          }
        }
        clearInterval(gettingResultItems);
      }
    }, 1000)
  },
  handleClickFilterBtn() {
    let minMile = document.querySelector('input[name=minmile]').value;
    let maxMile = document.querySelector('input[name=maxmile]').value;
    let minOffer = document.querySelector('input[name=minoffer]').value;
    let blockcities = document.querySelector('input[name=blockcities]').value;
    let blockstates = document.querySelector('input[name=blockstates]').value;
    // if (convertToFloat(minMile) > convertToFloat(maxMile)) {
    //   return;
    // }
    Inject.filtering(
      convertToFloat(minMile),
      convertToFloat(maxMile),
      convertToFloat(minOffer),
      convertToArray(blockcities),
      convertToArray(blockstates)
    )
  },
  filtering(minMile, maxMile, minOffer, blockcitiesArr, blockstatesArr) {
    let rows = Inject.cache.resultItemsList;
    let numRows = rows.length;
    for (let i = 0; i < numRows; i++) {
      let resultItem = rows[i];
      if (resultItem === null) {
        continue;
      }
      let rateStr = resultItem.querySelector('.rate').innerHTML;
      let tripStr = resultItem.querySelector('.trip>a') !== null ? resultItem.querySelector('.trip>a').innerHTML : "";
      let originStr = resultItem.querySelector('.origin').innerHTML;
      let destStr = resultItem.querySelector('.dest').innerHTML;
      let rate = convertToFloat(rateStr);
      let trip = convertToFloat(tripStr);
      let originCity = convertToArray(originStr)[0];
      let originState = convertToArray(originStr)[1];
      let destCity = convertToArray(destStr)[0];
      let destState = convertToArray(destStr)[1];
      let underline = (trip < minMile) ||
        ((maxMile !== 0) && (maxMile < trip)) ||
        (rate < minOffer) ||
        checkIfContainEle(blockcitiesArr, [originCity, destCity]) ||
        checkIfContainEle(blockstatesArr, [originState, destState]);
      resultItem.querySelector('.line-through')?.remove();

      if (underline) {
        resultItem.style.position = "relative";
        let domLine = document.createElement('div');
        domLine.className = "line-through";
        domLine.style.height = "1px";
        domLine.style.background = 'black';
        domLine.style.position = "absolute";
        domLine.style.zIndex = "2"
        domLine.style.width = "100%";
        domLine.style.top = "12px";

        resultItem.append(domLine);
      }
    }
  },
  calculatorBox(rate, trip, dho) {
    let boxDom = document.createElement('div');
    boxDom.className = "calculator-box";
    boxDom.style.position = "absolute";
    boxDom.style.zIndex = 2;
    boxDom.style.padding = "18px";
    boxDom.style.border = "1px solid black";
    boxDom.style.marginLeft = "280px";
    let offerDiv = Inject.createInputDom('offer', "Rate(offer)", 'number');
    let offerInputDom = offerDiv.querySelector('input[name=offer]');
    offerInputDom.step = 50;
    offerInputDom.value = rate;
    let rpmDiv = Inject.createInputDom('rpm', 'Rate Per Mile', 'number');
    let rpmInputDom = rpmDiv.querySelector('input[name=rpm]');
    rpmInputDom.step = 0.25;
    rpmInputDom.value = (trip + dho) !== 0 ? rate / (trip + dho) : 0;
    offerInputDom.addEventListener('input', (e) => {
      e.stopPropagation();
      if ((trip + dho) !== 0)
        rpmInputDom.value = convertToFloat(e.target.value) / (trip + dho)

    })
    rpmInputDom.addEventListener('input', (e) => {
      e.stopPropagation();
      offerInputDom.value = convertToFloat(e.target.value) * (trip + dho);
    })
    boxDom.append(offerDiv);
    boxDom.append(rpmDiv);
    return boxDom;
  },
  injectRowEvent(rowItem) {
    const rowItemChanged = setInterval(function () {
      let rateInfoViewDom = rowItem.querySelector('.rateViewInfo');
      if (rateInfoViewDom != null) {
        rateInfoViewDom.querySelector('.calculator-box')?.remove();
        let rateStr = rowItem.querySelector('.rate').innerHTML;
        let tripStr = rowItem.querySelector('.trip>a') !== null ? rowItem.querySelector('.trip>a').innerHTML : "";
        let dhoStr = rowItem.querySelector('.do').innerHTML;
        let rate = convertToFloat(rateStr);
        let trip = convertToFloat(tripStr);
        let dho = convertToFloat(dhoStr);
        let calBox = Inject.calculatorBox(rate, trip, dho);
        rateInfoViewDom.append(calBox);
        clearInterval(rowItemChanged)
      }
    }, 500)
  }
}

function convertToFloat(string) {
  let patt = /[^\w.]|_/g;
  let res = parseFloat(string.replace(patt, ''));
  return isNaN(res) ? 0 : res;
}
function convertToArray(string) {
  var wordArray = [];
  wordArray = string.match(/\b[-?(\w+)?]+\b/gi);

  return wordArray === null ? [] : wordArray;
}
function checkIfContainEle(array1, array2) {
  const array1Lower = array1.map(e => e.toLowerCase());
  const array2Lower = array2.map(e => e.toLowerCase());
  const intersection = array2Lower.filter(element => array1Lower.includes(element));
  if (intersection.length === 0)
    return false;
  return true;
}
window.addEventListener("load", function () {
  Inject.init();
  let scrollDom = document.querySelector("#searchResults").querySelector('.fixed-table-container-inner');
  scrollDom.addEventListener('scroll', () => {
    let scrollLockDom = scrollDom.querySelector('.resultItem.qa-scrollLock');
    let parent = scrollLockDom.parentNode;
    let index = Array.prototype.indexOf.call(parent.childNodes, scrollLockDom)
    if (index % 40 === 0) {
      Inject.paintingRows(index);
      Inject.handleClickFilterBtn();
    }
  })
});
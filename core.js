export const ParsePage = async (page) => {
  return await page.evaluate(async () => {
    let listNewsOne = [];
    let ListNewsGlobal = [];
    let listNewsTow = [];
    let listNewsThree = [];
    let listNewsObjOne = {};
    let listNewsObjTow = {};
    let listNewsObjThree = {};

    let listAr = await document.querySelectorAll(".container_news");
    await listAr.forEach((el) => {
      listNewsOne = [...el.children[0].children[1].children];
      el.children[0].children[4] === undefined
        ? (listNewsTow = undefined)
        : (listNewsTow = [...el.children[0].children[4].children]);
      el.children[0].children[7] === undefined
        ? (listNewsThree = undefined)
        : (listNewsThree = [...el.children[0].children[7].children]);
    });

    const OneData =
      listAr[0].children[0].children[0].children[1].children[0].innerHTML;
    const TowData = !listAr[0].children[0].children[3].children[0].children[0]
      ? undefined
      : listAr[0].children[0].children[3].children[0].children[0].innerHTML;
    const ThreeData = !listAr[0].children[0].children[6]
      ? undefined
      : listAr[0].children[0].children[6].children[0].children[0].innerHTML;


    const Constructor = (ObjectElS, ConstructorObj, Data) => {
      if (ObjectElS) {
        ObjectElS.forEach((li) => {
          ConstructorObj = {
            data_time: li.children[1].children[0].innerHTML,
            data: Data,
            title: li.children[1].children[2].innerHTML,
            img: li.children[0].children[0].children[0].src,
            description: li.children[1].children[3].innerHTML,
            href: li.children[0].children[0].href,
          };
          ListNewsGlobal.push(ConstructorObj);
        });
      }
    };
    Constructor(listNewsOne, listNewsObjOne, OneData);
    Constructor(listNewsTow, listNewsObjTow, TowData);
    Constructor(listNewsThree, listNewsObjThree, ThreeData);
    return ListNewsGlobal;
  });
};

export const StopParse = async (browser, counter, flag, LIMIT) => {
  if (counter >= LIMIT) {
    await browser.close();
    flag = false;
    counter = 0;
  }
};

export const UpdateData = async (accumulator, parserBrowser, timeout) => {
  setInterval(async () => {
    accumulator = [];
    parserBrowser().catch((e) => {
      console.log(e);
    });
  }, timeout);
};

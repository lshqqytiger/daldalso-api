import Axios from "axios";
import Puppeteer from "puppeteer";

async function* asyncGenerator(initial, n) {
  let i = initial;
  while (i < n) {
    yield i++;
  }
}

const URL: any = {
  javaUsers: "https://sorry.daldal.so/java/users",
  javaSongs: "https://sorry.daldal.so/java/charts",
  songList: "https://sorry.daldal.so",
  search: "https://sorry.daldal.so/search",
  daldalsoUsers: "https://daldal.so/world/channels",
  moremDic: "https://morem.daldal.so/query",
  kkutuList: "https://kkutu.kr",
};

const getUsers = async (id: string, pw: string) => {
  const browser = await Puppeteer.launch();
  const page = await browser.newPage();
  let data: string;

  await page.goto(URL.daldalsoUsers);

  await page.evaluate(
    (ida, pwa) => {
      (document.querySelector('input[name="id"]') as HTMLInputElement).value =
        ida;
      (
        document.querySelector('input[name="password"]') as HTMLInputElement
      ).value = pwa;
    },
    id,
    pw
  );

  await page.click('button[class="abutton"]');

  await page.waitForTimeout(1000);

  const element1 = await page.$(
    'pre[style="word-wrap: break-word; white-space: pre-wrap;"]'
  );
  data = await page.evaluate((element1) => element1.textContent, element1);
  await browser.close();
  return JSON.parse(data);
};

const Sorrydl = {
  getList: async (page?: number) => {
    if (page) {
      return (
        await Axios.post(`${URL.search}`, {
          title: "",
          artist: "",
          tag: "",
          order: "",
          page,
        })
      ).data.list;
    } else {
      let list = [];

      list = list.concat(
        (
          await Axios.post(`${URL.search}`, {
            title: "",
            artist: "",
            tag: "",
            order: "",
            page: 0,
          })
        ).data.list
      );

      for await (let i of asyncGenerator(1, Math.floor(list[0].id / 30))) {
        list = list.concat(
          (
            await Axios.post(`${URL.search}`, {
              title: "",
              artist: "",
              tag: "",
              order: "",
              page: i,
            })
          ).data.list
        );
      }

      return list;
    }
  },

  search: async (type: string, value: any) => {
    let result: any;
    let options: any;
    if (type == "detail") {
      options = {
        title: value.title || "",
        artist: value.artist || "",
        tag: value.tag || "",
        order: "",
        page: 0,
      };
    } else {
      options = {
        title: type == "title" ? value : "",
        artist: type == "artist" ? value : "",
        tag: type == "tag" ? value : "",
        order: "",
        page: 0,
      };
    }

    result = await Axios.post(`${URL.search}`, options);

    if (!result || !result.data) return;
    else {
      return result.data.list;
    }
  },
};
const Java = {
  getSongList: async (
    mode: string,
    theme: string | number,
    page?: string | number,
    playable?: boolean
  ) => {
    let result = await Axios.get(
      encodeURI(
        `${URL.javaSongs}?mode=${mode}&theme=${theme}${
          page ? "&page=" + page : ""
        }`
      )
    );

    if (!result || !result.data) return;

    if (playable) {
      for (let i in result.data) {
        if (result.data[i].status == 1) delete result.data[i];
        else continue;
      }
    }

    for (let i in result.data) {
      if (result.data[i].mode != mode) delete result.data[i];
      else continue;
    }

    result.data = result.data.filter((element, i) => element != null);

    if (result.data.length > 15) {
      result.data = result.data.slice(0, 15);
    }

    return result.data;
  },
  getUsersList: async () => {
    let result = await Axios.get(URL.javaUsers);

    if (!result || !result.data) return;
    else {
      return result.data.users;
    }
  },
  getUsers: async () => {
    let result = await Axios.get(URL.javaUsers);

    if (!result || !result.data || !result.data.users) return;
    else {
      return result.data.users.length;
    }
  },
};
const Etc = {
  getKKuTuServers: async () => {
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    let data: any;

    await page.goto(URL.kkutuList);

    await page.addScriptTag({ path: "kkutulist.js" });

    const list = await page.$('h1[id="KKUTULIST"]');

    data = await page.evaluate((list) => list.textContent, list);

    await browser.close();
    return data;
  },

  getMorem: async (data) => {
    let result = await Axios.get(encodeURI(`${URL.moremDic}?q=${data}`));

    if (!result || !result.data) return;
    else {
      return result.data.list;
    }
  },
};

export { Java, Sorrydl, Etc, getUsers };

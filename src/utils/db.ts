import Dexie, { Table } from 'dexie';

export interface DailyCookieCount {
  id?: number;
  date: string;
  count: number;
}

export interface CookieCache {
  name: string;
  category: string;
}

export class CrumblDexie extends Dexie {
  counts!: Table<DailyCookieCount>; 

  constructor() {
    super('crumblDatabase');
    this.version(1).stores({
      counts: 'date, count' // Primary key and indexed props
    });
    console.log("initialize Crumbl database");
  }
}

export const db = new CrumblDexie();

export const updateDailyCount = async () => {
  try {
    const d = new Date();
    const td = d.toISOString().substring(0,10)

    chrome.cookies.getAll({}, (cookies) => {
      db.counts.put({date: td, count: cookies.length});
    })

  } catch(error) {
    console.log("error in putting daily cookies count");
  }
}

export const getDailyCount = () => {
  return db.counts.toArray();
}

export const initDatabase = async () => {
  console.log("checking if daily count is empty");
  db.counts.toCollection().last().then((item) => {
    if (item === undefined) {
      try {
        const d = new Date();
        d.setDate(d.getDate()-1);
        const td = d.toISOString().substring(0,10)
    
        chrome.cookies.getAll({}, (cookies) => {
          db.counts.put({date: td, count: cookies.length});
        })
    
      } catch(error) {
        console.log("error in initializing daily cookies count");
      }
    };
  });
}

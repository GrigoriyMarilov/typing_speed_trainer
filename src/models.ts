export type TLang = "ru" | "en" | "de";
export type TTimer = 15 | 30 | 60;

interface PracticeData {
    text: string;
    lang: string;
    author: string;
    title: string;
}

export class Practice {
    public text;
    public lang;
    public author;
    public title;
    public wordCount;

    constructor(data: PracticeData) {
        this.text = data.text;
        this.lang = data.lang;
        this.author = data.author;
        this.title = data.title;
        this.wordCount = data.text.split(" ").length
    }
}


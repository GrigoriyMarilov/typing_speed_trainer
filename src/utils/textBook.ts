import {TLang, Practice} from "../models.ts";



export const TextBook: Practice[] = [
    new Practice({
        text: "Человек есть тайна. Её надо разгадать, и если будешь разгадывать всю жизнь, не говори, что потерял время; я занимаюсь этой тайной, потому что хочу быть человеком. И чтобы понять человека, нужно научиться видеть его не только в моменте, но и в процессе, через который он проходит.",
        lang: "ru",
        author: "Фёдор Достоевский",
        title: "Преступление и наказание",
    }),
    new Practice({
        text: "Вы слишком много рассуждаете, а это иногда мешает делу. Дело состоит в том, чтобы вовремя принять решение и действовать. Не стоит мучиться вопросами, ответов на которые нет. Суть в том, чтобы не бояться перемен и уметь вовремя подстраиваться под новые обстоятельства, которые могут быть решающими.",
        lang: "ru",
        author: "Михаил Булгаков",
        title: "Мастер и Маргарита",
    }),
    new Practice({
        text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.",
        lang: "en",
        author: "Jane Austen",
        title: "Pride and Prejudice",
    }),
    new Practice({
        text: "People generally see what they look for, and hear what they listen for. But before jumping to conclusions, one must consider that every story has two sides. What you see on the surface is not always a true reflection of reality. It takes courage and understanding to look deeper and see the truth hidden beneath.",
        lang: "en",
        author: "Harper Lee",
        title: "To Kill a Mockingbird",
    }),
    new Practice({
        text: "Zwei Seelen wohnen, ach! in meiner Brust, die eine will sich von der anderen trennen. Die eine zieht mich in die Welt mit freudiger Liebe, die andere hebt mich ab von dieser Welt, mich in die Sphären der Götter zu erheben. Es ist ein innerer Kampf, der nie enden will, ein Ringen zwischen Geist und Materie, zwischen Pflicht und Verlangen.",
        lang: "de",
        author: "Johann Wolfgang von Goethe",
        title: "Faust",
    }),
    new Practice({
        text: "Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. Die Welt um ihn herum schien plötzlich fremd und feindselig zu werden, ein Ort, wo Gerechtigkeit nicht existiert und jeder Schritt ein weiteres Missverständnis birgt, das ihn tiefer in den Abgrund führt.",
        lang: "de",
        author: "Franz Kafka",
        title: "Der Prozess",
    })
]

export const getTextByLang = (lang: TLang): Practice[] => {
    return TextBook.filter(text => text.lang === lang)
}
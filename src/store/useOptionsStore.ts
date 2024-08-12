import {create} from 'zustand'


interface IOptionsStore {
    lang: "ru" | "en" | "de";
}
//это не законченный блок в дальнейшем хочу добавить параметры настроек дял тестов
const useOptionsStore = create<IOptionsStore>(() => ({
    lang: "ru",
}))


export default useOptionsStore
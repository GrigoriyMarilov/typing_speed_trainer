import "./page.scss"
import Settings from "../../widgets/settings/settings.tsx";
import {TypingSpeedTrainer} from "../../widgets/typingSpeedTrainer/typingSpeedTrainer.tsx";

const Page = () => {
    return (
        <>

            <main>
                <Settings/>
                <TypingSpeedTrainer/>
            </main>
        </>
    );
};

export default Page;
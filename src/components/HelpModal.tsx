import { MdAdsClick } from 'react-icons/md';

const HelpModal = (props: any) => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            props.handleHelp();
        }
    });

    return (
        <div
            onClick={props.handleHelp}
            className="fixed inset-0 dark:bg-black/50 bg-black/10 z-50 flex items-center justify-center print:hidden">
            <div className="relative min-w-96 w-1/4 dark:bg-neutral-900 text-xl bg-white p-6 rounded-4xl shadow-lg grid gap-2">
                <h1 className="text-2xl font-semibold">Ativar o Modo de edição</h1>
                <span className="flex items-center gap-1">
                    <span className="border-1 dark:border-neutral-800 border-neutral-300 px-1.5 rounded">
                        ctrl
                    </span>
                    +
                    <span className="border-1 dark:border-neutral-800 border-neutral-300 px-1.5 rounded">
                        e
                    </span>
                </span>
                <p className="flex items-center gap-1">
                    <span className="border-1 dark:border-neutral-800 border-neutral-300 px-1.5 rounded">
                        shift
                    </span>
                    + {<MdAdsClick size={22} title="double click" />}
                </p>
            </div>
        </div>
    );
};

export default HelpModal;

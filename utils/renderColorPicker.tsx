const COLORS = [
    'red',
    'amber',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
];

export function ColorPicker(props: { setField: any; currentColor: string }) {
    const { setField, currentColor }: { setField: any; currentColor: string } = props;
    return (
        <div className="grid grid-cols-5 justify-around gap-5">
            <span className="hidden bg-red-500 bg-orange-500 bg-amber-500 bg-yellow-500 bg-lime-500 bg-green-500 bg-emerald-500 bg-teal-500 bg-cyan-500 bg-sky-500 bg-blue-500 bg-indigo-500 bg-violet-500 bg-purple-500 bg-fuchsia-500 bg-pink-500 bg-rose-500"></span>
            <span className="hidden border-red-500 border-orange-500 border-amber-500 border-yellow-500 border-lime-500 border-green-500 border-emerald-500 border-teal-500 border-cyan-500 border-sky-500 border-blue-500 border-indigo-500 border-violet-500 border-purple-500 border-fuchsia-500 border-pink-500 border-rose-500"></span>
            <span className="hidden text-red-400 text-orange-400 text-amber-400 text-yellow-400 text-lime-400 text-green-400 text-emerald-400 text-teal-400 text-cyan-400 text-sky-400 text-blue-400 text-indigo-400 text-violet-400 text-purple-400 text-fuchsia-400 text-pink-400 text-rose-400"></span>

            {COLORS.map((color) => (
                <div
                    onClick={() => setField(color)}
                    key={color}
                    className={
                        currentColor === color
                            ? `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500 ring-white ring-2 border-white`
                            : `size-12 rounded-full cursor-pointer hover:brightness-50 bg-${color}-500`
                    }></div>
            ))}
        </div>
    );
}

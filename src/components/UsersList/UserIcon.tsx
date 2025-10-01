import { useUser } from '../../../context/Context';
import type { CardUser } from '../../../types';
import { getInitials } from '../../../utils/getInitials';

export function UserIcon(props: {
    filteredUser: CardUser | null;
    setFilteredUser: Function;
    user: { name: string; color: string };
    index: number;
    presentation: boolean;
}) {
    const { user } = useUser();
    return (
        <div className="group">
            <div
                className={
                    props.filteredUser?.name === props.user.name
                        ? `select-none text-white ring-2 transition-all dark:ring-neutral-200 ring-neutral-500 ring-offset-white dark:ring-offset-slate-800 bg-${
                              props.user.color
                          }-500 h-12 w-12 rounded-full grid place-items-center cursor-pointer hover:ring-offset-1 ${
                              props.presentation &&
                              `font-semibold text-2xl transition-all ring-none! px-6 h-12 w-auto!`
                          }`
                        : `select-none text-white bg-${props.user.color}-500 hover:ring-2 ring-offset-1 ring-neutral-500 ring-offset-white dark:ring-offset-slate-800 hover:ring-neutral-300 dark:hover:ring-white/50 h-12 w-12 rounded-full grid place-items-center cursor-pointer`
                }
                onClick={() => {
                    if (props.presentation && !user?.superUser) return;
                    if (props.filteredUser?.name === props.user.name)
                        return props.setFilteredUser(null);

                    props.setFilteredUser(props.presentation ? props.index : props.user);
                }}>
                {props.presentation && props.filteredUser?.name === props.user.name
                    ? props.user.name
                    : getInitials(props.user.name)}
                <small className="absolute mt-24 px-4 py-1.5 rounded-xl group-hover:grid hidden dark:bg-neutral-800 border bg-neutral-100 text-neutral-700 border-neutral-300 dark:text-white dark:border-neutral-700 text-nowrap">
                    {props.user.name}
                </small>
            </div>
        </div>
    );
}

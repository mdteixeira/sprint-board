import type { CardUser } from "../../../types";
import { UserIcon } from "./UserIcon";

export function UsersFilter(props: {
    users: CardUser[];
    filteredUser: CardUser | null;
    setFilteredUser: React.Dispatch<React.SetStateAction<CardUser | null>>;
}) {
    return (
        <div className="flex space-x-3">
            {props.users.map((user: CardUser) => {
                return (
                    <UserIcon
                        key={user.name}
                        filteredUser={props.filteredUser}
                        setFilteredUser={props.setFilteredUser}
                        user={user}></UserIcon>
                );
            })}
        </div>
    );
}
import type { CardUser } from '../../../types';
import { UserIcon } from './UserIcon';

export function UsersFilter(props: {
    users: CardUser[];
    filteredUser: CardUser | null;
    setFilteredUser: React.Dispatch<React.SetStateAction<any>>;
    presentation: boolean;
}) {
    return (
        <div className={`flex space-x-3 ${props.presentation ? '' : ''}`}>
            {props.users.map((user: CardUser, index) => {
                return (
                    <UserIcon
                        key={user.name}
                        index={index}
                        filteredUser={props.filteredUser}
                        setFilteredUser={props.setFilteredUser}
                        presentation={props.presentation}
                        user={user}></UserIcon>
                );
            })}
        </div>
    );
}

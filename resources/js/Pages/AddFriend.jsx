import PeopleYouMayKnow from "@/components/FriendsMayKnow";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import FriendReuest from "@/components/PendingRequest";
import { Head } from '@inertiajs/react';

export default function AddFriend() {
    return (
        <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Add Friends
            </h2>
        }
    >
        <Head title="Add Friends" />



            <FriendReuest />
            <PeopleYouMayKnow />
       



    </AuthenticatedLayout>
    );
  }

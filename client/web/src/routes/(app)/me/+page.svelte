<script>
    import {areaFetch} from "$lib/utils/areaFetch";

    export let data;

    let userInfos = getUserInfos();
    let user = data.user;

    async function getUserInfos() {
        const response = await areaFetch('/me')
        const json = await response.json()
        return {
            status: response.status,
            ...json
        };
    }
</script>

<section class="h-[125vh] w-[100vw] flex justify-center items-center">
    {#await userInfos}
        <p></p>
    {:then userInfos}
            <div>
                <h1 class="absolute top-20 left-1/2 -translate-x-1/2 text-4xl font-bold text-area-header">Welcome {userInfos.user.username}</h1>
                    <div class="absolute block top-32 left-1/2 -translate-x-1/2 w-[50px] h-[4px] bg-area-header text-black font-bold rounded-2xl"></div>
                    <p class="absolute block left-12 top-48 font-bold text-2xl text-area-header">Account informations</p>
                    <p class="absolute block left-1/2 top-48 font-bold text-2xl text-area-header">Actions</p>
                    <div class="absolute block left-1/2 top-56 w-[315px] h-[4px] bg-area-header text-black font-bold rounded-2xl">
                        <div class="block flex-col my-10 w-[550px] h-[700px] bg-area-header rounded-xl shadow-2xl">
                        </div>
                    </div>
                    <div class="absolute block left-12 top-56 w-[315px] h-[4px] bg-area-header text-black font-bold rounded-2xl">
                        <div class="block flex-col my-10 w-[550px] h-[700px] bg-area-header rounded-xl shadow-2xl">
                            <p class="absolute block left-6 top-20 text-white font-bold text-xl">Username : {userInfos.user.username}</p>
                            <p class="absolute block my-10 left-6 top-20 text-white font-bold text-xl">Password : ******</p>
                            <a class="absolute my-10 left-6 top-28 text-white font-bold hover:underline text-xs text-area-blue" href="/">Change password</a>
                            <p class="absolute block my-14 left-6 top-32 text-white font-bold text-xl">Email : {userInfos.user.email}</p>
                            <div class="absolute block my-12 top-44 left-4 w-[250px] h-[2px] bg-gray-400 text-black font-bold rounded-2xl"></div>
                            <p class="absolute block left-6 my-9 top-52 text-white font-bold text-xl">Date of creation : {userInfos.user.createdAt}</p>
                            <p class="absolute block left-6 my-14 top-64 text-white font-bold text-xl">Account verified : {userInfos.user.verified}</p>
                        </div>
                </div>
            </div>
    {:catch error}
        ok
    {/await}
</section>
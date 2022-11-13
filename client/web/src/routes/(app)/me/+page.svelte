<script>
    import {areaFetch} from "../../../lib/utils/areaFetch";

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
    console.log(user);
</script>

<section class="h-[100vh] w-[100vw]">
    {#await userInfos}
        <p></p>
    {:then userInfos}
            <div class="flex justify-center items-center w-[300px] h-[200px] backdrop-blur-sm bg-white/40 rounded-2xl text-black font-bold">{userInfos.user.username}</div>
    {/await}
</section>
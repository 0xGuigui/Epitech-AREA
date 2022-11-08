<script lang="ts">
    import {fly} from "svelte/transition";
    import {loggedIn} from "../../store";
    import {onDestroy} from "svelte";
    import {icons} from "../utils/fontAwesome";
    import {clickOutside} from "../utils/clickOutside";
    import AreaButton from "$lib/components/AreaButton.svelte";
    import Fa from "svelte-fa";

    let showDropdown = false;
    let userLoggedIn = $loggedIn;
    let unsubscribe = loggedIn.subscribe(value => {
        userLoggedIn = value;
    });
    let updateDropdown = () => {
        showDropdown = !showDropdown;
    };
    let dropDownActions = {
        "Profile": () => {
            console.log("profile");
        },
        "Logout": () => {
            showDropdown = false;
            loggedIn.set(false);
        }
    }

    onDestroy(() => {
        unsubscribe();
    });
</script>

<section in:fly={{duration: 150}} class="relative text-white flex justify-between items-center">
    <!-- Auth guard -->
    {#if userLoggedIn}
        <AreaButton on:click={updateDropdown} width="40" height="40" class="ml-5">
            <Fa icon={icons.faUser}/>
        </AreaButton>
    {:else}
        <AreaButton redirectUrl="/login" width="100" height="40">
            <span class="font-bold">Login</span>
        </AreaButton>
        <AreaButton redirectUrl="/register" width="100" height="40" class="ml-5">
            <span class="font-bold">Register</span>
        </AreaButton>
    {/if}
    <!-- Dropdown -->
    {#if showDropdown}
        <div
                transition:fly={{duration: 150}}
                use:clickOutside
                on:click_outside={updateDropdown}
                class="z-50 absolute right-0 top-[63px] w-52 rounded-lg text-white bg-area-button overflow-hidden">
            {#each Object.entries(dropDownActions) as value, idx}
                <div
                        in:fly={{duration: 250, delay: idx * 50 + 100}}
                        on:click={value[1]}
                        class="select-none cursor-pointer flex justify-center items-center w-full h-10 hover:bg-area-blue transition-all duration-150">
                    <span class="font-white font-bold">{value[0]}</span>
                </div>
            {/each}
        </div>
    {/if}
</section>

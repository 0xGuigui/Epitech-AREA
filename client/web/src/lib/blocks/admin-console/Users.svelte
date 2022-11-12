<script lang="ts">
	import {areaFetch} from "../../utils/areaFetch";
	import ListBuilder from "$lib/components/ListBuilder.svelte";
	import UserViewer from "$lib/blocks/admin-console/viewers/UserViewer.svelte";
	import {icons} from "../../utils/fontAwesome";

	async function fetchUsers(page = 1) {
		let response = await areaFetch("/users?page=" + page);
		usersPromise = response.json();
	}

	async function deleteUsers(userData: object) {
		console.log("delete user", userData);
	}

	const actions = [
		{
			name: "logout",
			icon: icons.faSignOutAlt,
			action: (userData: object) => {
				console.log("logout user", userData);
			}
		},
		{
			name: "delete",
			icon: icons.faTrashAlt,
			action: deleteUsers
		},
	];

	function handleActionTrigger(e) {
		console.log(e.detail);
	}

	let usersPromise = fetchUsers();
</script>

<section>
	{#await usersPromise}
		<div class="w-screen h-screen flex justify-center items-center">
			<img src="/loaders/ball-triangle.svg" alt="Loading svg">
		</div>
	{:then users}
		<ListBuilder
				dataList={users.users}
				hasExtraData={false}
				viewer={UserViewer}
				{actions}
				on:actionTrigger={handleActionTrigger}
				on:refresh={(e) => fetchUsers(e.detail.page)}
		/>
	{:catch error}
		<div class="w-screen h-screen flex justify-center items-center">
			An error occurred: {error.message}
		</div>
	{/await}
</section>

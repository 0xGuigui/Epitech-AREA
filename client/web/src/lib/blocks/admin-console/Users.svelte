<script lang="ts">
	import {areaFetch} from "../../utils/areaFetch";
	import ListBuilder from "$lib/components/ListBuilder.svelte";
	import UserViewer from "$lib/blocks/admin-console/viewers/UserViewer.svelte";
	import {icons} from "../../utils/fontAwesome";

	async function fetchUsers(page = 1) {
		let response = await areaFetch("/users?page=" + page);
		usersPromise = response.json();
	}

	async function deleteUsers(usersData: object[]) {
		let promises = usersData.map((user) => {
			return areaFetch("/users/" + user["_id"], "DELETE");
		});

		await Promise.all(promises);
		await fetchUsers();
	}

	async function logoutUsers(usersData: object[]) {
		let promises = usersData.map(user => {
			return areaFetch("/users/" + user["_id"] + "/logout");
		});

		await Promise.all(promises);
	}

	async function verifyUsers(usersData: object[]) {
		let promises = usersData.map(user => {
			return areaFetch("/users/" + user["_id"], "PUT", {
				verified: "true",
			});
		});

		await Promise.all(promises);
		await fetchUsers();
	}

	const actions = [
		{
			name: "verify",
			icon: icons.faCheck,
			action: verifyUsers,
		},
		{
			name: "logout",
			icon: icons.faSignOutAlt,
			action: logoutUsers,
		},
		{
			name: "delete",
			icon: icons.faTrashAlt,
			action: deleteUsers
		},
	];

	function matchTriggeredAction(e) {
		actions.find((action) => {
			return action.name === e.detail.name;
		})?.action(e.detail.data);
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
				on:actionTrigger={matchTriggeredAction}
				on:refresh={fetchUsers}
		/>
	{:catch error}
		<div class="w-screen h-screen flex justify-center items-center">
			An error occurred: {error.message}
		</div>
	{/await}
</section>

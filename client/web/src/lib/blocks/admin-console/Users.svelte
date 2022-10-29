<script lang="ts">
	export let data: object;
	let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzUzYWE2ZmMzNTRiNWQ1OTNkYTFkZGMiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjY2NzMwOTQ2LCJleHAiOjE2NjY4MDI5NDZ9.RxnMdXXcvr227RK205VT_f_9EVwwbFz7u2l2_hRY3Qs";

	async function getUsers() {
		let response = await fetch("http://localhost:8080/users", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});
		return await response.json();
	}

	async function deleteUser(id) {
		let response = await fetch(`http://localhost:8080/users/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});
		if (response.status == 200) {
			usersPromise = getUsers();
		}
		return await response.json();
	}

	let usersPromise = getUsers();
</script>

<section class="w-full h-full flex flex-col justify-center items-center">
	{#await usersPromise}
		<img src="/loaders/ball-triangle.svg" alt="Loading svg">
	{:then users}
		{#if users.users.length > 0}
			<div class="h-full w-full pt-10">
				{#each users.users as user}
					<div class="py-1.5 px-4 w-[800px] border border-gray-600 rounded my-1 mx-auto">
						<div class="flex justify-between">
							<div class="text-2xl font-bold text-area-blue">
							<span
								class="transition-all duration-100 border-area-blue hover:border-b-2">{user.username}</span>
								<span class="text-black text-lg">({user.email})</span>
							</div>
							<div class="h-6 w-6 bg-red-600 rounded" on:click={() => { deleteUser(user._id) }}></div>
						</div>
						<div class="text-sm flex justify-between items-center mt-1">
							<div>id: {user._id}</div>
							<div>admin: {user.admin}</div>
							<div>verified: {user.verified}</div>
							<div>user since: {new Date(user.createdAt).toDateString()}</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<h1>Nothing to show there !</h1>
		{/if}
	{:catch error}
		An error occurred: {error.message}
	{/await}
</section>

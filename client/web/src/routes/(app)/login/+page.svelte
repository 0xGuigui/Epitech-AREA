<script>
    import {createForm} from "svelte-forms-lib";

    const {form, handleChange, handleSubmit} = createForm({
        initialValues: {
            title: "",
            name: "",
            email: ""
        },
        onSubmit: values => {
            alert(JSON.stringify(values));
        }
    });
</script>

<section class="h-[100vh] w-[100vw] area-fade2 flex justify-center items-center">
    <div
        data-aos="fade-up"
        class="shadow-2xl w-[350px] h-[500px] backdrop-blur-sm bg-white/30 rounded-3xl">
        <form class="flex flex-col justify-center items-center h-full text-white" on:submit={handleSubmit}>
            <div class="">
                <label class="block font-bold" for="name">Username</label>
                <input
                        id="name"
                        name="name"
                        on:change={handleChange}
                        bind:value={$form.name}
                />
            </div>
            <div class="my-5">
                <label class="block font-bold" for="email">Email</label>
                <input
                        id="email"
                        name="email"
                        on:change={handleChange}
                        bind:value={$form.email}
                />
            </div>
            <button class="font-bold my-5 mr-2 py-2 px-6 bg-area-button hover:bg-area-blue hover:scale-110 transition-all duration-150 rounded-lg" type="submit">Submit</button>
        </form>
    </div>
</section>

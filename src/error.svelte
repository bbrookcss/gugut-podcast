<!-- Error.svelte -->
<script>
    export let error;
</script>

<main>
    <h1>Error</h1>
    <p>{error.message}</p>
</main>

<style>
    /* Add styling for the error page */
    main {
        padding: 20px;
    }
</style>
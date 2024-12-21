document.addEventListener('DOMContentLoaded', () => {
    // Edit Thought
    document.querySelectorAll('i[data-id="Edit"]').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.closest('div .card').getAttribute('id');

            window.location.href = `/thoughts/edit/${id}`;
        })
    })

    // Remove Thought
    document.querySelectorAll('i[data-id="Remove"]').forEach(el => {
        el.addEventListener('click', async () => {
            const id = el.closest('div .card').getAttribute('id');
            try {
                const response = await fetch(`/thoughts/remove/${id}`, {
                    method: 'delete',
                })

                if (!response.ok) {
                    throw new Error('Response Status: ' + response.status)
                }

                const data = await response.json()

                window.location.href = '/thoughts/dashboard';

            } catch (error) {
                console.log(error)
            }
        })
    })
})
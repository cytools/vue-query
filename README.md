### How to install

The installation is very simple. Just install the package with your favourite package manager:

#### NPM

`npm install --save @cytools/vue-query`

#### Yarn

`yarn add @cytools/vue-query`

---

And you are all set. Now comes the fun part.

![image](https://media1.tenor.com/images/03e054d9928b5137884289352d9ae9cb/tenor.gif)

### How to use

#### Simple

You can use vue-query wherever you want. But it does require the installation of `vue@next` or `@vue/composition-api`.

```js
import { useQuery } from '@cytools/vue-query';

const { data, isLoading } = useQuery(
    'luke-man',
    async () => {
        const response = await fetch('https://swapi.dev/api/people/1');
        const data = await response.json();

        return data;
    }
);

console.log(data.value.name); // Should Print "Luke Skywalker"
```

#### Simple but with key change

You can pass an array as the key of the query and in that array you can put a Ref object from vue. If the ref changes the query will be
refetched if the generated key is not in the cache.

```js
import { ref, watch } from '@vue/composition-api'; // you can change composition api to vue
import { useQuery } from '@cytools/vue-query';

const personId = ref(1);
const { data, isLoading } = useQuery(
    ['star-wars-person', personId], // => this generates a key something like this ['star-wars-person', {value: 1}] 
    async (currentPersonId) => {
        const response = await fetch(`https://swapi.dev/api/people/${currentPersonId}`);
        const data = await response.json();

        return data;
    }
);

console.log(data.value.name); // Should Print "Luke Skywalker"

personId.value = 2; // this will update the key of the query and refetch with a different person

watch(data, (newPerson) => {
    console.log(newPerson.name) // => Should print C-3PO
});
```

Since the queries are cached, if you change the `personId.value` to 1, it will not refetch, but it will retrieve the data from the cache.

```js
personId.value = 1;

// after event loop

console.log(data.value.name); // => Should print Luke Skywalker
```

#### Pagination

To take advantage of pagination, you can use `useQuery`, but everytime you change the page key it will flicker as it removes old data while
fetching for the new one. You can disable this behaviour with the option `keepPreviousData`

```js
import { ref } from '@vue/composition-api'; // you can change composition api to vue
import { useQuery } from '@cytools/vue-query';

const page = ref(1);
const { data } = useQuery(
    ['star-wars-people', page],
    async (currentPage) => {
        const response = await fetch(`https://swapi.dev/api/people/${currentPage}`);
        const data = await response.json();

        return data;
    },
    {
        keepPreviousData: true,
    }
);
```

But there is a better version of this with some helpers returned. It returns a bunch of helpers for pagination and it handles the change of
page logic inside it. The only additional thing to be done is to update the return data from the query.

```js
import { usePaginateQuery } from '@cytools/vue-query';

const {
    data,
    currentPage,
    hasMorePages,
    fetchPrevPage,
    fetchNextPage,
    isPrevButtonActive,
    isNextButtonActive,
    canShowPaginationButtons,
} = usePaginateQuery(
    'star-wars-people',
    async (currentPage) => {
        const response = await fetch(`https://swapi.dev/api/people/${currentPage}`);
        const data = await response.json();

        return { data, hasNextPage: false };
    }
);
```

- `canShowPaginationButtons`: It returns true only if we have more than one pages. It is useful if you do not want to show the pagination
  buttons if the returned data doesn't have more than only one page.

- `currentPage`: It returns the current page the pagination query is on.

- `fetchPrevPage`: Gets the previous page.

- `fetchNextPage`: Gets the next page.

- `isPrevButtonActive`: Returns true if we can go back a page.

- `isNextButtonActive`: Returns true if we can go to the next page.

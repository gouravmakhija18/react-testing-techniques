# Difference between queryBy, getBy and findBy queries

The queries returned by the `render()` function in React Testing Library give us
a way to find elements on a page. For example, in the test below,
`getByLabelText` is used to find an input element and `getByText` is used to
find the submit button.

```tsx
test('displays a validation error if validation fails', async () => {
  const { findAllByText, getByLabelText, getByText } = render(
    <TestForm onSubmit={handleSubmit} />
  );

  // Submit form with only firstName filled
  userEvent.type(getByLabelText('First name'), 'John');
  userEvent.click(getByText('Submit'));

  // Expect to see a validation errors
  expect(await findAllByText('Field is required')).toHaveLength(5);
});
```

However, React Testing Library offers several query types (`queryBy...`,
`getBy...` and `findBy...`) that are useful in different use cases. The
difference is in their behavior for different number of matches found and
whether they wait for the element to appear. The table below summarizes this
behaviour:

|         | No Match | 1 Match | 1+ Match | Await? |
| ------- | -------- | ------- | -------- | ------ |
| queryBy | null     | return  | throw    | No     |
| getBy   | throw    | return  | throw    | No     |
| findBy  | throw    | return  | throw    | Yes    |

- `queryBy` is the most lenient query which returns a null if no match is found
  and returns the element when a match is found.
- `getBy` is a stricter query which throws if no match is found. So this one
  should be used when you expect the element to be available, otherwise you want
  the test to fail.
- `findBy` is similar to `getBy` in the sense that it will throw if the element
  is not available, but it waits upto a timeout period (default is 1000ms) for
  the element to appear. Use this query type if you are expecting the element to
  appear after sometime, e.g. if your test is fetching data to show the element.
  `findBy` queries are asynchronous and should be always used with `await`.

Finally, note that all these queries will throw if they find more than 1
matches. If you are expecting this, use the "All" versions of the queries:
`queryAllBy...`, `getAllBy...` and `findAllBy...`.

For more details, visit the following links:

- [React Testing Library | Queries](https://testing-library.com/docs/react-testing-library/cheatsheet/#queries)

- [DOM Testing Library | Queries](https://testing-library.com/docs/queries/about/)

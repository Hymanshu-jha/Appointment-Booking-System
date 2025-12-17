export default function Store(data) {
  return {
    ...data,
    save: async () => ({
      _id: "store123",
      ...data
    })
  };
}

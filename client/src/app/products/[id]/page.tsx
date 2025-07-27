import { fetchProductFromId } from "@/lib/requests";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const product = await fetchProductFromId(parseInt(id));
  console.log(product);
  return <div>uhuhuhu</div>;
};
export default Page;

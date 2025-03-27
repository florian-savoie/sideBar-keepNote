"use client";
import { Button } from "@/components/ui/button";
import Navbar from "../../components/Navbar";
import ItemsCard from "../../components/ui/ItemsCard";
import { useAlert } from "@/contexts/Alert";

export default function Dashboard() {
  const { addAlert } = useAlert();

  return (
    <>
      <Navbar>
        <h3 className="text-center text-primary">text</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <ItemsCard key={index} />
          ))}
        </div>
      </Navbar>
    </>
  );
}

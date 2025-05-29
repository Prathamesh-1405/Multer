/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { jwtDecode } from "jwt-decode"; // swapped this in
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface IUser {
  _id: string;
  email: string;
  name: string;
  contact: string;
}

interface DecodedToken {
  userId: string;
  // other fields if any
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async (pageNumber: number, userId: string, searchQuery: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/api/added?page=${pageNumber}&userId=${userId}&search=${searchQuery}`
      );
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token: any = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token); // safely decode token on client
      fetchUsers(page, decoded.userId, searchQuery);
    } else {
      router.push("/login");
    }
  }, [page, searchQuery]);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Users</h1>
      <Input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-80 mb-4"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Loading...</TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No users found.</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.contact}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex gap-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="pt-2">
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

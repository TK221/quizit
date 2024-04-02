"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, {
      message: "Username must be at least 3 characters long",
    })
    .max(20, {
      message: "Username must be at most 20 characters long",
    }),
  lobbyId: z.string().min(1, { message: "Lobby-ID must be given" }),
});

const JoinLobby = (params: { lobbyId?: string }) => {
  const router = useRouter();

  const joinLobby = api.lobby.join.useMutation({
    onSuccess(_, variables) {
      router.push(`/lobby/${variables.lobbyId}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      lobbyId: params.lobbyId ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    joinLobby.mutate(values);
  };

  return (
    <Card>
      <CardHeader>Join existing Lobby</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lobbyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lobby-ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Join</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JoinLobby;

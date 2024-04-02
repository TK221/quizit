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
  lobbyName: z
    .string()
    .max(20, {
      message: "Lobby name must be at most 20 characters long",
    })
    .trim(),
});

const CreateLobby = () => {
  const router = useRouter();

  const createLobby = api.lobby.create.useMutation({
    onSuccess(data) {
      router.push(`/lobby/${data}`);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lobbyName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createLobby.mutate({ lobbyName: values.lobbyName });
  };

  return (
    <Card>
      <CardHeader>Create a new Lobby</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="lobbyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lobby name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateLobby;

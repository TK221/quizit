"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
    .trim()
    .min(1, {
      message: "Lobby name must be at least 1 character long",
    })
    .max(20, {
      message: "Lobby name must be at most 20 characters long",
    }),
  maxQuestions: z
    .string()
    .or(z.number())
    .transform(Number)
    .pipe(z.number().int().gte(1).lte(500)),
  correctAnswerPoints: z
    .string()
    .or(z.number())
    .transform(Number)
    .pipe(z.number().int().gte(-500).lte(500)),
  wrongAnswerPoints: z
    .string()
    .or(z.number())
    .transform(Number)
    .pipe(z.number().int().gte(-500).lte(500)),
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
      maxQuestions: 10,
      correctAnswerPoints: 3,
      wrongAnswerPoints: 1,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createLobby.mutate({
      lobbyName: values.lobbyName,
      maxQuestions: values.maxQuestions,
      correctAnswerPoints: values.correctAnswerPoints,
      wrongAnswerPoints: values.wrongAnswerPoints,
    });
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
            <FormField
              control={form.control}
              name="maxQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount of Questions</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    You are not restricted to this amount.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="correctAnswerPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points for correct answer</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of points a player receives for a correct answer
                    (Negative values are allowed).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wrongAnswerPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points for wrong answer</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of points the other players receive for a wrong
                    answer from a player (negative values are allowed).
                  </FormDescription>
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

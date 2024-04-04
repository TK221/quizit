"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../_components/ui/button";
import { Card, CardHeader, CardContent } from "../_components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../_components/ui/form";
import { Input } from "../_components/ui/input";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username must be given" })
    .max(20, { message: "Username can't be longer than 20 characters" }),
});

const ProfileSettings = (props: { username: string }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: props.username,
    },
  });

  const updateProfile = api.profile.update.useMutation({
    onSuccess: () => {
      toast.success("Profile successfully updated", {
        description: "Changes can take a while to reflect",
        duration: 5000,
      });
      router.refresh();
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateProfile.mutate({ name: values.username });
  };

  return (
    <Card>
      <CardHeader>Profile Settings</CardHeader>
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
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;

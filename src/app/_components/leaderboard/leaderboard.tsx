"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { api } from "~/trpc/react";

export function Leaderboard() {
  const profiles = api.profile.getTopProfiles.useQuery();

  return (
    <Table>
      <TableCaption>Leaderboard of the top players</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/2">Username</TableHead>
          <TableHead className="text-right">Won</TableHead>
          <TableHead className="text-right">Played</TableHead>
          <TableHead className="text-right">Correct Answers</TableHead>
          <TableHead className="text-right">Wrong Answers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.data?.map((profile) => (
          <TableRow key={profile.userId}>
            <TableCell className="font-medium">{profile.user.name}</TableCell>
            <TableCell className="text-right">{profile.gamesWon}</TableCell>
            <TableCell className="text-right">{profile.gamesPlayed}</TableCell>
            <TableCell className="text-right">
              {profile.correctAnswers}
            </TableCell>
            <TableCell className="text-right">{profile.wrongAnswers}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

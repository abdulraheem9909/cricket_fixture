"use client"
import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MatchFixture = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // router.push("/match-fixture/coming-soon");
    }
  }, [isAuthenticated, router]);

  return <Container><Typography variant="h4">Coming Soon</Typography></Container>;
};

export default MatchFixture;

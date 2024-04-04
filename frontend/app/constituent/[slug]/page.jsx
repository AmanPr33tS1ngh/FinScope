"use client";

import Dashboard from "@/components/Constituent/Constituent";
import React from "react";

const DashboardPage = ({ params }) => {
  const slug = params.slug;
  return <Dashboard slug={slug} />;
};

export default DashboardPage;

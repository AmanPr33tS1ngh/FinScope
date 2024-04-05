"use client";

import React from "react";
import Constituent from "@/components/Constituent/Constituent";

const DashboardPage = ({ params }) => {
  const slug = params.slug;
  return <Constituent slug={slug} />;
};

export default DashboardPage;

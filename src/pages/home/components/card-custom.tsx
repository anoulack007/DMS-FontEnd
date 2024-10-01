import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MoneyIcon from "@mui/icons-material/Money";
import PersonIcon from "@mui/icons-material/Person";

// Icon mapping
const iconMap = {
  trendingUp: TrendingUpIcon,
  money: MoneyIcon,
  person: PersonIcon,
};

// Define types
type IconName = keyof typeof iconMap;

interface CardListModel {
  id: number;
  title: string;
  total: string;
  icon?: IconName;
}

// Individual Card Component
const IndividualCard: React.FC<CardListModel> = ({ title, total, icon }) => {
  
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <Card sx={{ height: "100%", borderRadius: 4 }}>
      <CardContent
        sx={{ height: "100%", py: 2, display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {IconComponent && <IconComponent sx={{ mr: 1, fontSize: 24 }} />}
          <Typography variant="subtitle2" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Main Card Custom Component
const CardCustom: React.FC = () => {
  const CardList: CardListModel[] = [
    {
      id: 1,
      title: "Freelance ທັງໝົດ",
      total: "250 ຄົນ",
      icon: "person",
    },
    {
      id: 2,
      title: "Freelance ໃໝ່",
      total: "100 ຄົນ",
      icon: "money",
    },
    {
      id: 3,
      title: "Freelance ໃໝ່",
      total: "100 ຄົນ",
      icon: "money",
    },
    {
      id: 4,
      title: "Freelance ໃໝ່",
      total: "100 ຄົນ",
      icon: "money",
    },
  ];

  return (
    <Grid container spacing={3}>
      {CardList.map((item) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
          <IndividualCard {...item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CardCustom;

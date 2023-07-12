import {
  Title,
  Drawer,
  createStyles,
  Header,
  Container,
  Text,
  Button,
  Burger,
  Group,
  rem,
  ScrollArea,
  Divider,
  UnstyledButton,
  Center,
  Box,
  Collapse,
} from "@mantine/core";
import Image from "next/image";
import { getMe } from "@/api/auth";
import useSWR from "swr";
import PlateHolderImg from "@/public/img/landing_ramen.png";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";

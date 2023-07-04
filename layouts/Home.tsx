import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Image,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Banner from '@/components/home/Banner';
import SideBar from '@/components/home/SideBar';
import SearchLoading from '@/components/Loading/searchLoading';
import { CategoryBanner } from '@/components/misc/listingsCard';
import type { User } from '@/interface/user';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';
import { userStore } from '@/store/user';

type IDefaultProps = {
  children: ReactNode;
};

interface TotalType {
  total?: number;
  count?: number;
  totalInUSD?: number;
}

interface SidebarType {
  totals?: TotalType;
  earners?: User[];
}

function Home(props: IDefaultProps) {
  const router = useRouter();
  const { userInfo } = userStore();
  const [isTotalLoading, setIsTotalLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategoryBanner, setShowCategoryBanner] = useState(false);

  const [sidebarInfo, setSidebarInfo] = useState<SidebarType>({});

  const getTotalInfo = async () => {
    setIsTotalLoading(true);
    try {
      const aggregatesData = await axios.get('/api/sidebar/');
      setSidebarInfo(aggregatesData.data);
      setIsTotalLoading(false);
    } catch (e) {
      setIsTotalLoading(false);
    }
  };

  useEffect(() => {
    if (!isTotalLoading) return;
    getTotalInfo();
  }, []);

  useEffect(() => {
    if (router.asPath.includes('search') && router.query.search) {
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }

    if (router?.query?.filter) {
      setShowCategoryBanner(true);
    } else {
      setShowCategoryBanner(false);
    }
  }, [router.asPath, router.query]);
  const Skills = [
    'Frontend',
    'Backend',
    'Blockchain',
    'Design',
    'Growth',
    'Content',
    'Community',
    'Other',
    'Mobile',
    'Fullstack',
  ];
  const streamteams = [
    {
      name: 'Superteam Germany',
      bg: `/assets/category_assets/bg/content.png`,
      color: '#CBD5E1',
      icons: '/assets/streamteams/germany.jpg',
      region: 'Germany',
    },
    {
      name: 'Superteam UK',
      bg: `/assets/category_assets/bg/growth.png`,
      color: '#BFA8FE',
      icons: '/assets/streamteams/uk.png',
      region: 'UK',
    },
    {
      name: 'Superteam India',
      bg: `/assets/category_assets/bg/design.png`,
      color: '#FEFBA8',
      icons: '/assets/streamteams/india.jpg',
      region: 'India',
    },
    {
      name: 'Superteam Mexico',

      bg: `/assets/category_assets/bg/frontend.png`,
      color: '#FEA8EB',
      icons: '/assets/streamteams/mexico.jpg',
      region: 'Mexico',
    },
    {
      name: 'Superteam Turkey',
      bg: `/assets/category_assets/bg/backend.png`,
      color: '#FEEBA8',
      icons: '/assets/streamteams/turkey.jpg',
      region: 'Turkey',
    },
    {
      name: 'Superteam Finland',
      bg: `/assets/category_assets/bg/backend.png`,
      color: '#213874',
      icons: '/assets/streamteams/vietnam.png',
      region: 'Vietnam',
    },
  ];
  return (
    <Default
      className="bg-white"
      meta={
        <Meta
          title="StreamConnect"
          description="Every Solana opportunity in one place!"
          canonical="/assets/logo/og.svg"
        />
      }
    >
      <Container maxW={'7xl'} mx="auto">
        <HStack
          align="start"
          justify="space-between"
          my={{ base: 6, md: !userInfo?.id ? 12 : 8 }}
        >
          <Flex
            w="full"
            pr={{ base: 0, md: 6 }}
            borderRight={{ base: 'none', md: '1px solid' }}
            borderRightColor={{ base: 'none', md: 'blackAlpha.200' }}
          >
            {showSearch ? (
              <SearchLoading />
            ) : (
              <Box w="full">
                {!userInfo?.id && !router.asPath.includes('regions') && (
                  <Banner />
                )}
                {showCategoryBanner && (
                  <CategoryBanner
                    type={
                      Skills.find(
                        (type) =>
                          type.toLocaleLowerCase() ===
                          router?.query?.filter?.toString().toLocaleLowerCase()
                      ) as string
                    }
                  />
                )}
                {router.asPath.includes('regions') && (
                  <>
                    <Flex
                      direction={{ md: 'row', base: 'column' }}
                      w={{ md: 'brand.120', base: '100%' }}
                      h={{ md: '7.375rem', base: 'fit-content' }}
                      mt={6}
                      mb={8}
                      mx={'auto'}
                      p={6}
                      bg={`url(${
                        streamteams.find(
                          (e) =>
                            e.region.toLowerCase() ===
                            String(router.query.slug).toLowerCase()
                        )?.bg
                      })`}
                      bgSize={'cover'}
                      rounded={10}
                    >
                      <Center
                        w={14}
                        h={14}
                        mr={3}
                        bg={
                          streamteams.find(
                            (e) =>
                              e.region.toLowerCase() ===
                              String(router.query.slug).toLowerCase()
                          )?.color
                        }
                        rounded={'md'}
                      >
                        <Image
                          borderRadius={'5px'}
                          alt="Category icon"
                          src={
                            streamteams.find(
                              (e) =>
                                e.region.toLowerCase() ===
                                String(router.query.slug).toLowerCase()
                            )?.icons
                          }
                        />
                      </Center>
                      <Box
                        w={{ md: '80%', base: '100%' }}
                        mt={{ base: 4, md: '0' }}
                      >
                        <Text fontFamily={'Domine'} fontWeight={'700'}>
                          {
                            streamteams.find(
                              (e) =>
                                e.region.toLowerCase() ===
                                String(router.query.slug).toLowerCase()
                            )?.name
                          }
                        </Text>
                        <Text color={'brand.slate.500'} fontSize={'small'}>
                          Welcome to Superteam{' '}
                          {
                            streamteams.find(
                              (e) =>
                                e.region.toLowerCase() ===
                                String(router.query.slug).toLowerCase()
                            )?.region
                          }{' '}
                          earnings page — use these opportunities to earn in
                          global standards and gain membership in the most
                          exclusive Solana community of{' '}
                          {
                            streamteams.find(
                              (e) =>
                                e.region.toLowerCase() ===
                                String(router.query.slug).toLowerCase()
                            )?.region
                          }
                          !
                        </Text>
                      </Box>

                      <Toaster />
                    </Flex>
                  </>
                )}
                {props.children}
              </Box>
            )}
          </Flex>
          <Flex
            display={{
              base: 'none',
              lg: 'flex',
            }}
            marginInlineStart={'0 !important'}
          >
            <SideBar
              total={sidebarInfo?.totals?.totalInUSD ?? 0}
              listings={sidebarInfo?.totals?.count ?? 0}
              earners={sidebarInfo?.earners ?? []}
              jobs={[]}
              userInfo={userInfo! || {}}
            />
          </Flex>
        </HStack>
      </Container>
    </Default>
  );
}

export default Home;

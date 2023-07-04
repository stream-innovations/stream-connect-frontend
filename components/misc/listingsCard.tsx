/* eslint-disable no-nested-ternary */
import { BellIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import type { BountyType } from '@prisma/client';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { TiTick } from 'react-icons/ti';

import type { BountyStatus } from '@/interface/bounty';
import type { Notifications } from '@/interface/user';
import { dayjs } from '@/utils/dayjs';
import { Mixpanel } from '@/utils/mixpanel';

import { tokenList } from '../../constants';
import { TalentStore } from '../../store/talent';
import { userStore } from '../../store/user';
import { updateNotification } from '../../utils/functions';
import { EarningModal } from '../modals/earningModal';

type ListingSectionProps = {
  children?: React.ReactNode;
  title: string;
  sub: string;
  emoji: string;
  type: 'bounties' | 'jobs' | 'grants';
};

export const ListingSection = ({
  children,
  title,
  sub,
  emoji,
  type,
}: ListingSectionProps) => {
  const router = useRouter();

  return (
    <Box
      display={
        router.query.category
          ? router.query.category === (type as string) ||
            router.query.category === 'all'
            ? 'block'
            : 'none'
          : 'block'
      }
      w={{ md: '100%', base: '98%' }}
      mx={'auto'}
      my={10}
    >
      <HStack
        align="center"
        justify="space-between"
        mb={4}
        pb={3}
        borderBottom="2px solid"
        borderBottomColor="#E2E8F0"
      >
        <Flex align={'center'}>
          <Image
            w={'1.4375rem'}
            h={'1.4375rem'}
            mr={'0.75rem'}
            alt="emoji"
            src={emoji}
          />
          <Text
            color={'#334155'}
            fontSize={{ base: 14, md: 16 }}
            fontWeight={'600'}
          >
            {title}
          </Text>
          <Text
            display={['none', 'none', 'block', 'block']}
            mx={3}
            color={'brand.slate.300'}
            fontSize={'xxs'}
          >
            |
          </Text>
          <Text
            display={['none', 'none', 'block', 'block']}
            color={'brand.slate.400'}
            fontSize={{ base: 12, md: 14 }}
          >
            {sub}
          </Text>
        </Flex>
        <Flex display={router?.query?.category !== type ? 'block' : 'none'}>
          <Link
            href={
              router?.query?.filter
                ? `/${type}/${router?.query?.filter}/`
                : `/${type}/`
            }
            onClick={() => {
              Mixpanel.track('view_all', {
                type: title,
              });
            }}
          >
            <Button color="brand.slate.400" size="sm" variant="ghost">
              View All
            </Button>
          </Link>
        </Flex>
      </HStack>
      <Flex direction={'column'} rowGap={'2.625rem'}>
        {children}
      </Flex>
    </Box>
  );
};

const textLimiter = (text: string, len: number) => {
  if (text.length > len) {
    return `${text.slice(0, len)}...`;
  }
  return text;
};

interface BountyProps {
  title?: string;
  rewardAmount?: number;
  deadline?: string;
  logo?: string;
  status?: BountyStatus;
  token?: string;
  slug?: string;
  sponsorName?: string;
  type?: BountyType | string;
}

export const BountiesCard = ({
  rewardAmount,
  deadline,
  type,
  logo,
  title = '',
  token,
  slug = '',
  sponsorName,
}: BountyProps) => {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  return (
    <>
      <Link
        p={2}
        borderRadius={5}
        _hover={{
          textDecoration: 'none',
          bg: 'gray.100',
        }}
        href={`/listings/bounties/${slug}`}
        onClick={() => {
          Mixpanel.track('bounty_clicked', {
            element: 'title',
            'Bounty Title': title,
          });
        }}
      >
        <Flex
          align="start"
          justify="space-between"
          w={{ base: '100%', md: 'brand.120' }}
          h={16}
        >
          <Flex w="100%" h={16}>
            <Image
              w={16}
              h={16}
              mr={5}
              alt={sponsorName}
              rounded={5}
              src={logo || `${router.basePath}/assets/images/sponsor-logo.png`}
            />
            <Flex justify={'space-between'} direction={'column'} w={'full'}>
              <Text
                color="brand.slate.700"
                fontSize={['xs', 'xs', 'sm', 'sm']}
                fontWeight={600}
                _hover={{
                  textDecoration: 'underline',
                }}
                onClick={() => {
                  Mixpanel.track('bounty_clicked', {
                    element: 'title',
                    'Bounty Title': title,
                  });
                }}
              >
                {isMobile ? textLimiter(title, 20) : textLimiter(title, 40)}
              </Text>
              <Text
                w={'full'}
                color={'brand.slate.500'}
                fontSize={{ md: 'sm', base: 'xs' }}
              >
                {sponsorName}
              </Text>
              <Flex align={'center'} gap={isMobile ? 1 : 3}>
                <Flex align={'center'} justify="start">
                  <Image
                    w={4}
                    h={4}
                    mr={1}
                    alt={token}
                    rounded="full"
                    src={
                      tokenList.find((ele) => {
                        return ele.tokenSymbol === token;
                      })?.icon
                    }
                  />

                  <Text
                    color={'brand.slate.700'}
                    fontSize={['x-small', 'xs', 'sm', 'sm']}
                    fontWeight={'600'}
                  >
                    {rewardAmount}
                  </Text>
                </Flex>
                <Text
                  color={'brand.slate.300'}
                  fontSize={['xx-small', 'xs', 'sm', 'sm']}
                >
                  |
                </Text>
                <Text
                  color={'brand.slate.500'}
                  fontSize={['x-small', 'xs', 'sm', 'sm']}
                >
                  {dayjs().isBefore(deadline)
                    ? `Closing ${dayjs(deadline).fromNow()}`
                    : `Closed ${dayjs(deadline).fromNow()}`}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Button
            minW={24}
            h={isMobile ? 7 : 9}
            px={6}
            fontSize={['xx-small', 'xs', 'sm', 'sm']}
            variant="outlineSecondary"
          >
            {dayjs().isAfter(deadline)
              ? 'View'
              : type === 'permissioned'
              ? 'Apply'
              : 'Submit'}
          </Button>
        </Flex>
      </Link>
    </>
  );
};
interface JobsProps {
  title: string;
  description?: string;
  max?: number;
  min?: number;
  maxEq?: number;
  minEq?: number;
  skills?: string;
  logo?: string;
  orgName: string;
  link?: string;
  location?: string;
}
export const JobsCard = ({
  description,
  max,
  min,
  maxEq,
  minEq,
  title,
  logo,
  orgName,
  link,
  location,
}: JobsProps) => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  return (
    <Link
      p={2}
      borderRadius={5}
      _hover={{
        textDecoration: 'none',
        bg: 'gray.100',
      }}
      href={link}
      isExternal
      onClick={() => {
        Mixpanel.track('job_clicked', {
          element: 'title',
          'Job Title': title,
        });
      }}
    >
      <Flex
        align="start"
        justify="space-between"
        w={{ base: '100%', md: 'brand.120' }}
        h={16}
      >
        <Flex justify="start">
          <Image
            w={16}
            h={16}
            mr={5}
            alt={'company logo'}
            rounded={5}
            src={logo || '/assets/home/placeholder/ph2.png'}
          />
          <Flex justify={'space-between'} direction={'column'}>
            <Text
              color="brand.slate.700"
              fontSize={['xs', 'xs', 'sm', 'sm']}
              fontWeight="600"
            >
              {isMobile ? textLimiter(title, 20) : textLimiter(title, 40)}
            </Text>
            <Text
              color="brand.slate.400"
              fontSize={['xs', 'xs', 'sm', 'sm']}
              fontWeight={400}
            >
              {description
                ? parse(
                    description?.startsWith('"')
                      ? JSON.parse(description || '')?.slice(0, 100)
                      : (description ?? '')?.slice(0, 100)
                  )
                : orgName}
            </Text>
            <Flex align={'center'}>
              {!!min && !!max && (
                <Text
                  mr={3}
                  color={'brand.slate.500'}
                  fontSize={['xs', 'xs', 'sm', 'sm']}
                >
                  <Text as="span" fontWeight="700">
                    ${' '}
                  </Text>
                  {min.toLocaleString()} - {max.toLocaleString()}
                </Text>
              )}
              {!!minEq && !!maxEq && (
                <Text
                  mr={3}
                  color={'brand.slate.500'}
                  fontSize={['xs', 'xs', 'sm', 'sm']}
                >
                  {minEq.toLocaleString()}% - {maxEq.toLocaleString()}% Equity
                </Text>
              )}
              {!!location && (
                <Text
                  key={''}
                  display={{ base: 'none', md: 'block' }}
                  mr={3}
                  color={'brand.slate.500'}
                  fontSize={['xs', 'xs', 'sm', 'sm']}
                >
                  {location}
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>

        <Button
          minW={24}
          h={isMobile ? 7 : 9}
          px={6}
          fontSize={['xs', 'xs', 'sm', 'sm']}
          variant="outlineSecondary"
        >
          Apply
        </Button>
      </Flex>
    </Link>
  );
};

interface GrantsProps {
  title: string;
  sponsorName?: string;
  logo?: string;
  rewardAmount?: number;
  token?: string;
  slug: string;
  short_description?: string;
}
export const GrantsCard = ({
  title,
  logo,
  rewardAmount,
  sponsorName,
  slug,
  short_description,
}: GrantsProps) => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  return (
    <>
      <Link
        p={2}
        borderRadius={5}
        _hover={{
          textDecoration: 'none',
          bg: 'gray.100',
        }}
        href={`/listings/grants/${slug}`}
        onClick={() => {
          Mixpanel.track('grant_clicked', {
            element: 'title',
            'Grant Title': title,
          });
        }}
      >
        <Flex
          align="start"
          justify="space-between"
          w={{ base: '100%', md: 'brand.120' }}
          h={16}
        >
          <Flex justify="start" h={16}>
            <Image
              w={16}
              h={16}
              mr={5}
              alt={'company logo'}
              rounded={5}
              src={logo || '/assets/home/placeholder/ph3.png'}
            />
            <Flex justify="start" direction="column">
              <Text
                color="brand.slate.700"
                fontSize={['xs', 'xs', 'sm', 'sm']}
                fontWeight="600"
              >
                {isMobile ? textLimiter(title, 20) : textLimiter(title, 40)}
              </Text>
              <Text
                color="brand.slate.400"
                fontSize={['xs', 'xs', 'sm', 'sm']}
                fontWeight="400"
              >
                {sponsorName}
              </Text>

              {rewardAmount && (
                <Text
                  mr={3}
                  color={'brand.slate.500'}
                  fontSize={['xs', 'xs', 'sm', 'sm']}
                >
                  {short_description}
                </Text>
              )}
            </Flex>
          </Flex>

          <Button
            minW={24}
            h={isMobile ? 7 : 9}
            px={6}
            fontSize={['xs', 'xs', 'sm', 'sm']}
            variant="outlineSecondary"
          >
            Apply
          </Button>
        </Flex>
      </Link>
    </>
  );
};

type CategoryAssetsType = {
  [key: string]: {
    bg: string;
    desc: string;
    color: string;
    icon: string;
  };
};

export const CategoryBanner = ({ type }: { type: string }) => {
  const { userInfo } = userStore();
  const { talentInfo } = TalentStore();
  const [loading, setLoading] = useState(false);
  const categoryAssets: CategoryAssetsType = {
    Design: {
      bg: `/assets/category_assets/bg/design.png`,
      color: '#FEFBA8',
      desc: 'If delighting users with eye-catching designs is your jam, you should check out the earning opportunities below.',
      icon: '/assets/category_assets/icon/design.png',
    },
    Growth: {
      bg: `/assets/category_assets/bg/growth.png`,
      color: '#BFA8FE',
      desc: 'If you’re a master of campaigns, building relationships, or data-driven strategy, we have earning opportunities for you.',
      icon: '/assets/category_assets/icon/growth.png',
    },
    Content: {
      bg: `/assets/category_assets/bg/content.png`,
      color: '#CBD5E1',
      desc: 'If you can write insightful essays, make stunning videos, or create killer memes, the opportunities below are calling your name.',
      icon: '/assets/category_assets/icon/content.png',
    },
    Frontend: {
      desc: 'If you are a pixel-perfectionist who creates interfaces that users love, check out the earning opportunities below.',
      bg: `/assets/category_assets/bg/frontend.png`,
      color: '#FEA8EB',
      icon: '/assets/category_assets/icon/frontend.png',
    },
    Backend: {
      bg: `/assets/category_assets/bg/backend.png`,
      desc: 'Opportunities to build high-performance databases, on and off-chain. ',
      color: '#FEEBA8',
      icon: '/assets/category_assets/icon/backend.png',
    },
    Fullstack: {
      bg: `/assets/category_assets/bg/backend.png`,
      color: '#FEEBA8',
      desc: 'Unlock opportunities in crafting comprehensive solutions by seamlessly integrating user-friendly interfaces and robust databases, both on and off-chain',
      icon: '/assets/category_assets/icon/backend.png',
    },

    Blockchain: {
      bg: `/assets/category_assets/bg/contract.png`,
      desc: 'If you can write insightful essays, make stunning videos, or create killer memes, the opportunities below are calling your name.',
      color: '#A8FEC0',
      icon: '/assets/category_assets/icon/contract.png',
    },
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      {isOpen && <EarningModal isOpen={isOpen} onClose={onClose} />}
      <Flex
        direction={{ md: 'row', base: 'column' }}
        w={{ md: 'brand.120', base: '100%' }}
        h={{ md: '7.375rem', base: 'fit-content' }}
        mt={6}
        mb={8}
        mx={'auto'}
        p={6}
        bg={`url('${categoryAssets[type]?.bg}')`}
        bgSize={'cover'}
        rounded={10}
      >
        <Center
          w={14}
          h={14}
          mr={3}
          bg={categoryAssets[type]?.color}
          rounded={'md'}
        >
          <Image alt="Category icon" src={categoryAssets[type]?.icon} />
        </Center>
        <Box w={{ md: '60%', base: '100%' }} mt={{ base: 4, md: '0' }}>
          <Text fontFamily={'Domine'} fontWeight={'700'}>
            {type}
          </Text>
          <Text color={'brand.slate.500'} fontSize={'small'}>
            {categoryAssets[type]?.desc}
          </Text>
        </Box>
        <Button
          mt={{ base: 4, md: '' }}
          ml={{ base: '', md: 'auto' }}
          my={{ base: '', md: 'auto' }}
          px={4}
          color={'brand.slate.400'}
          fontWeight={'300'}
          bg={'white'}
          border={'1px solid'}
          borderColor={'brand.slate.500'}
          isLoading={loading}
          leftIcon={
            userInfo?.notifications?.find((e) => e?.label === type) ? (
              <TiTick />
            ) : (
              <BellIcon />
            )
          }
          onClick={async () => {
            if (!userInfo?.isTalentFilled) {
              onOpen();
              return;
            }
            if (userInfo?.notifications === null) {
              setLoading(true);
              await updateNotification(userInfo?.id as string, [
                {
                  label: type ?? '',
                  timestamp: Date.now(),
                },
              ]);
              Mixpanel.track('notification_added', {
                category: type,
                name: `${talentInfo?.firstname} ${talentInfo?.lastname}`,
              });
              setLoading(false);

              toast.success("You've been subscribed to this category");
              return;
            }

            if (userInfo?.notifications?.find((e) => e.label === type)) {
              setLoading(true);
              const notification: Notifications[] = [];

              userInfo?.notifications?.forEach((e) => {
                if (e.label !== type) {
                  notification.push({
                    label: e.label,
                    timestamp: Date.now(),
                  });
                }
              });
              await updateNotification(userInfo?.id as string, notification);
              setLoading(false);
              toast.success("You've been unsubscribed from this category");
              return;
            }

            setLoading(true);
            await updateNotification(userInfo?.id as string, [
              ...(userInfo?.notifications as Notifications[]),
              {
                label: type,
                timestamp: Date.now(),
              },
            ]);
            Mixpanel.track('notification_added', {
              category: type,
              name: `${talentInfo?.firstname} ${talentInfo?.lastname}`,
            });
            setLoading(false);
            toast.success("You've been subscribed to this category");
          }}
          variant="solid"
        >
          {userInfo?.notifications?.find((e) => e.label === type)
            ? 'Subscribed'
            : 'Notify Me'}
        </Button>
        <Toaster />
      </Flex>
    </>
  );
};

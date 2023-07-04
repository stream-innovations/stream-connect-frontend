import { Avatar, Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import type { User } from '@prisma/client';

type ChipType = {
  icon: string;
  label: string;
  value: string;
};

const overFlowText = (limit: number, text: string) => {
  if (text?.length >= limit) {
    return `${text.slice(0, limit - 3)}...`;
  }
  return text;
};

const Chip = ({ icon, label, value }: ChipType) => {
  return (
    <Flex>
      <Box
        alignItems={'center'}
        justifyContent={'center'}
        w={'2rem'}
        h={'2rem'}
        mr={'0.725rem'}
        p={'0.4rem'}
        bg={'#F6EBFF'}
        borderRadius="full"
      >
        <Image w={'100%'} h={'100%'} objectFit="contain" alt="" src={icon} />
      </Box>
      <Box>
        <Text color={'gray.400'} fontSize={'0.5813rem'} fontWeight={'400'}>
          {label}
        </Text>
        <Text
          maxW={'7rem'}
          fontSize={'0.775rem'}
          fontWeight={'400'}
          textOverflow={'ellipsis'}
        >
          {overFlowText(12, value)}
        </Text>
      </Box>
    </Flex>
  );
};

function TalentBio({
  user,
  successPage,
  w,
}: {
  user: User;
  successPage: boolean;
  w?: string;
}) {
  const socialLinks = [
    {
      icon: '/assets/talent/twitter.png',
      link: user?.twitter,
    },

    {
      icon: '/assets/talent/link.png',
      link: user?.linkedin,
    },

    {
      icon: '/assets/talent/github.png',
      link: user?.github,
    },

    {
      icon: '/assets/talent/site.png',
      link: user?.website,
    },
  ];

  return (
    <Box
      w={w ?? '80%'}
      px={'1.5625rem'}
      py={'1.125rem'}
      bg={'white'}
      borderRadius={10}
    >
      <Flex align={'center'}>
        <Avatar
          name={`${user?.firstName}${user?.lastName}`}
          size="lg"
          src={user?.photo as string}
        />
        <Box ml={'21'}>
          <Text fontSize={'md'} fontWeight={'600'}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text color={'gray.400'} fontSize={'sm'} fontWeight={'600'}>
            @
            {user?.username?.length! > 15
              ? `${user?.username?.slice(0, 15)}...`
              : user?.username}
          </Text>
        </Box>
      </Flex>
      <Text mt={4} color={'gray.400'} fontSize={'sm'} fontWeight={'400'}>
        {user?.bio}
      </Text>
      <Flex justify={'space-between'} mt={4}>
        {!user?.private && (
          <Chip
            icon={'/assets/talent/eyes.png'}
            label={'Interested In'}
            value={user?.workPrefernce as string}
          />
        )}
        <Chip
          icon={'/assets/talent/cap.png'}
          label={'Works At'}
          value={user?.currentEmployer as string}
        />
      </Flex>

      {successPage ? (
        <a style={{ textDecoration: 'none' }} href={`/t/${user?.username}`}>
          <Button w={'full'} mt={'1.575rem'} color={'white'} bg={'#637195'}>
            View Your Profile
          </Button>
        </a>
      ) : (
        <a style={{ textDecoration: 'none' }} href={`mailto:${user?.email}`}>
          <Button w={'full'} mt={'1.575rem'} color={'white'} bg={'#637195'}>
            Get in Touch
          </Button>
        </a>
      )}

      <Flex justify={'space-between'} mt={'32px'}>
        {socialLinks.map((ele, eleIndex) => {
          return (
            <Box
              key={eleIndex}
              onClick={() => {
                if (ele.link) {
                  window.location.href = ele.link;
                }
              }}
            >
              <Image
                w={6}
                h={6}
                opacity={!ele.link ? '0.3' : ''}
                cursor={ele.link! && 'pointer'}
                objectFit="contain"
                alt=""
                filter={!ele.link ? 'grayscale(80%)' : ''}
                src={ele.icon}
              />
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}

export default TalentBio;

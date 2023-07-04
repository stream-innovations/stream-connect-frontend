import {
  Box,
  Button,
  Flex,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Dispatch, SetStateAction } from 'react';
import React, { useCallback, useState } from 'react';
import { AiOutlineLink, AiOutlineOrderedList } from 'react-icons/ai';
import { BiFontColor } from 'react-icons/bi';
import {
  BsBlockquoteLeft,
  BsCodeSlash,
  BsFileBreak,
  BsTypeItalic,
} from 'react-icons/bs';
import { CiRedo, CiUndo } from 'react-icons/ci';
import { GoBold } from 'react-icons/go';
import {
  MdOutlineFormatListBulleted,
  MdOutlineFormatUnderlined,
  MdOutlineHorizontalRule,
} from 'react-icons/md';

import type { BountyBasicType } from './bounty/Createbounty';

const LinkModal = ({
  isOpen,
  onClose,
  setLink,
}: {
  isOpen: boolean;
  onClose: () => void;
  setLink: (link: string) => void;
}) => {
  const [linkUrl, setLinkUrl] = useState<string>('');
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody my={5}>
            <Input
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="add a link"
            />
            <HStack justify={'end'} w={'full'} mt={5}>
              <Button mr={4} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button onClick={() => setLink(linkUrl)} variant="solid">
                Submit
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface Props {
  setEditorData: Dispatch<SetStateAction<string | undefined>>;
  editorData: string | undefined;
  setSteps: Dispatch<SetStateAction<number>>;
  createDraft: () => void;
  bountyBasics?: BountyBasicType;
  draftLoading?: boolean;
  isEditMode?: boolean;
  setBountyRequirements?: Dispatch<SetStateAction<any | undefined>>;
  bountyRequirements?: string | undefined;
}
const Description = ({
  editorData,
  setEditorData,
  setSteps,
  createDraft,
  bountyBasics,
  draftLoading,
  isEditMode,
  bountyRequirements,
  setBountyRequirements,
}: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const editor = useEditor({
    extensions: [
      Underline,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure(),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Give more details about the Listing...',
        showOnlyWhenEditable: false,
      }),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setEditorData(html);
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
    content: editorData,
  });

  const setLink = useCallback(
    (url: string) => {
      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === '') {
        editor?.chain().focus().extendMarkRange('link').unsetLink().run();
        onClose();
        return;
      }

      // update link
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
      onClose();
    },
    [editor]
  );

  return (
    <>
      {isOpen && (
        <LinkModal setLink={setLink} isOpen={isOpen} onClose={onClose} />
      )}
      <Box>
        <Box mb={8}>
          <Flex justify="start" w="full">
            <Flex>
              <FormLabel
                color={'brand.slate.500'}
                fontSize={'15px'}
                fontWeight={600}
              >
                Eligibility Requirements
              </FormLabel>
              <Tooltip
                w="max"
                p="0.7rem"
                color="white"
                fontSize="0.9rem"
                fontWeight={600}
                bg="#637195"
                borderRadius="0.5rem"
                hasArrow
                label={`Add here if you have any specific eligibility requirements for the Listing.`}
                placement="right-end"
              >
                <Image
                  mt={-2}
                  alt={'Info Icon'}
                  src={'/assets/icons/info-icon.svg'}
                />
              </Tooltip>
            </Flex>
          </Flex>
          <Input
            w={'full'}
            color={'brand.slate.500'}
            borderColor="brand.slate.300"
            _placeholder={{
              color: 'brand.slate.300',
            }}
            focusBorderColor="brand.purple"
            id="bountyRequirements"
            maxLength={220}
            onChange={(e) =>
              setBountyRequirements && setBountyRequirements(e.target.value)
            }
            placeholder="Add Eligibility Requirements"
            type={'text'}
            value={bountyRequirements}
          />
          <Text
            color={
              (bountyRequirements?.length || 0) > 200
                ? 'red'
                : 'brand.slate.400'
            }
            fontSize={'xs'}
            textAlign="right"
          >
            {220 - (bountyRequirements?.length || 0)} characters left
          </Text>
        </Box>
        <Flex justify="start" w="full">
          <Flex>
            <FormLabel
              color={'brand.slate.500'}
              fontSize={'15px'}
              fontWeight={600}
            >
              Listing Details
            </FormLabel>
            <Tooltip
              w="max"
              p="0.7rem"
              color="white"
              fontSize="0.9rem"
              fontWeight={600}
              bg="#637195"
              borderRadius="0.5rem"
              hasArrow
              label={`Write details about the Listing - About, Requirements, Evaluation Criteria, Resources, Rewards, etc.`}
              placement="right-end"
            >
              <Image
                mt={-2}
                alt={'Info Icon'}
                src={'/assets/icons/info-icon.svg'}
              />
            </Tooltip>
          </Flex>
        </Flex>
        <VStack w={'3xl'} mb={8} mx={'auto'}>
          <Flex
            align={'center'}
            justify={'start'}
            w={'full'}
            borderBottom={'1px solid #D2D2D2'}
          >
            <Button
              bg={editor?.isActive('heading', { level: 1 }) ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderLeft={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 1 }).run();
              }}
              variant={'unstyled'}
            >
              H1
            </Button>
            <Button
              bg={editor?.isActive('heading', { level: 2 }) ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 2 }).run();
              }}
              variant={'unstyled'}
            >
              H2
            </Button>
            <Button
              bg={editor?.isActive('heading', { level: 3 }) ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 3 }).run();
              }}
              variant={'unstyled'}
            >
              H3
            </Button>
            <Button
              bg={editor?.isActive('heading', { level: 4 }) ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 4 }).run();
              }}
              variant={'unstyled'}
            >
              H4
            </Button>
            <Button
              bg={editor?.isActive('heading', { level: 5 }) ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 5 }).run();
              }}
              variant={'unstyled'}
            >
              H5
            </Button>
            <Button
              bg={editor?.isActive('heading', { level: 6 }) ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 6 }).run();
              }}
              variant={'unstyled'}
            >
              H6
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('bold') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleBold().run();
              }}
              variant={'unstyled'}
            >
              <GoBold />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('italic') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleItalic().run();
              }}
              variant={'unstyled'}
            >
              <BsTypeItalic />
            </Button>{' '}
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('underline') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleUnderline().run();
              }}
              variant={'unstyled'}
            >
              <MdOutlineFormatUnderlined />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('link') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                onOpen();
              }}
              variant={'unstyled'}
            >
              <AiOutlineLink />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('bulletList') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleBulletList().run();
              }}
              variant={'unstyled'}
            >
              <MdOutlineFormatListBulleted />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('orderedList') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleOrderedList().run();
              }}
              variant={'unstyled'}
            >
              <AiOutlineOrderedList />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('codeBlock') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleCodeBlock().run();
              }}
              variant={'unstyled'}
            >
              <BsCodeSlash />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              bg={editor?.isActive('blockquote') ? 'gray.200' : ''}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().toggleBlockquote().run();
              }}
              variant={'unstyled'}
            >
              <BsBlockquoteLeft />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().setHorizontalRule().run();
              }}
              variant={'unstyled'}
            >
              <MdOutlineHorizontalRule />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().setHardBreak().run();
              }}
              variant={'unstyled'}
            >
              <BsFileBreak />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              w={'full'}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().undo().run();
              }}
              variant={'unstyled'}
            >
              <CiUndo />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              w={'full'}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {
                editor?.chain().focus().redo().run();
              }}
              variant={'unstyled'}
            >
              <CiRedo />
            </Button>
            <Button
              alignItems={'center'}
              justifyContent={'center'}
              display={'flex'}
              w={'full'}
              borderTop={'1px solid #D2D2D2'}
              borderRight={'1px solid #D2D2D2'}
              borderRadius={'0px'}
              onClick={() => {}}
              variant={'unstyled'}
            >
              <BiFontColor />
            </Button>
          </Flex>

          <Box w={'full'} h={'full'}>
            <div style={{ height: '100% !important' }} className="reset">
              <EditorContent
                id="reset-des"
                style={{}}
                width={'100%'}
                height={'100%'}
                editor={editor}
              />
            </div>
          </Box>
        </VStack>
        <VStack gap={4} w={'full'} pt={10}>
          <Button
            w="100%"
            onClick={() => {
              if (bountyBasics?.type === 'open') {
                setSteps(5);
                return;
              }
              setSteps(4);
            }}
            variant="solid"
          >
            Continue
          </Button>
          <Button
            w="100%"
            isDisabled={!editorData}
            isLoading={draftLoading}
            onClick={() => createDraft()}
            variant="outline"
          >
            {isEditMode ? 'Update' : 'Save as Draft'}
          </Button>
        </VStack>
      </Box>
    </>
  );
};
export default Description;

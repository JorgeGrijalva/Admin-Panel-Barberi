import {
  MdOutlineShortText,
  MdOutlineArrowDropDownCircle,
} from 'react-icons/md';
import { GrTextAlignLeft } from 'react-icons/gr';
import { IoMdRadioButtonOn } from 'react-icons/io';
import { BsListCheck, BsCircleHalf } from 'react-icons/bs';
import { FaAudioDescription } from 'react-icons/fa';

export const ANSWER_TYPES = [
  'short_answer',
  'long_answer',
  'single_answer',
  'multiple_choice',
  'drop_down',
  'yes_or_no',
  'description_text',
];

export const ACTION_TYPES = {
  addNewFormItem: 'addNewFormItem',
  updateFormItem: 'updateFormItem',
  cancelFormItem: 'cancelFormItem',
  deleteActiveFormItem: 'deleteActiveFormItem',
  startUpdatingFormItem: 'startUpdatingFormItem',
  setFormItemsState: 'setFormItemsState',
  moveUpQuestion: 'moveUpQuestion',
  moveDownQuestion: 'moveDownQuestion',
  copyFormItem: 'copyFormItem',
};

export function createFormItemData(answerType) {
  const newItemState = { answerType: answerType };
  switch (answerType) {
    case 'short_answer':
      return {
        answer_type: answerType,
        question: 'New question',
        required: true,
      };
    case 'long_answer':
      return {
        answer_type: answerType,
        question: 'New question',
        required: true,
      };
    case 'single_answer':
      return {
        answer_type: answerType,
        question: 'New question',
        answer: ['New answer 1', 'New answer 2'],
        required: true,
      };
    case 'multiple_choice':
      return {
        answer_type: answerType,
        question: 'New question',
        answer: ['New answer 1', 'New answer 2'],
        required: true,
      };
    case 'drop_down':
      return {
        answer_type: answerType,
        question: 'New question',
        answer: ['New answer 1', 'New answer 2'],
        required: true,
      };
    case 'yes_or_no':
      return {
        answer_type: answerType,
        question: 'New question',
        required: true,
      };
    case 'description_text':
      return {
        answer_type: answerType,
        question: 'New text description',
      };
    default:
      break;
  }
  return newItemState;
}

export function getAnswerTypeIcon(answerType) {
  switch (answerType) {
    case 'short_answer':
      return <MdOutlineShortText size={24} />;
    case 'long_answer':
      return <GrTextAlignLeft size={24} />;
    case 'single_answer':
      return <IoMdRadioButtonOn size={24} />;
    case 'multiple_choice':
      return <BsListCheck size={24} />;
    case 'drop_down':
      return <MdOutlineArrowDropDownCircle size={24} />;
    case 'yes_or_no':
      return <BsCircleHalf size={24} />;
    case 'description_text':
      return <FaAudioDescription size={24} />;
    default:
      console.error('Unknown answerType');
      break;
  }
}

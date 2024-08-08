export default function formatSortType(type) {
  switch (type) {
    case 'ascend':
      return 'asc';

    case 'descend':
      return 'desc';

    default:
      break;
  }
}

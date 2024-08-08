// ** admin routes **
import AppRoutes from './admin/app';
import AddonRoutes from './admin/addon';
import BannerRoutes from './admin/banner';
import BlogRoutes from './admin/blog';
import BrandRoutes from './admin/brand';
import CareerCategoryRoutes from './admin/career-category';
import CareerRoutes from './admin/career';
import CategoryImport from './admin/category';
import CouponRoutes from './admin/coupon';
import CurrencyRoutes from './admin/currency';
import DeliveryRoutes from './admin/deliveries';
import EmailProvidersRoutes from './admin/email-provider';
import ExtrasRoutes from './admin/extras';
import FaqRoutes from './admin/faq';
import FoodRoutes from './admin/food';
import GalleryRoutes from './admin/gallery';
import LanguagesRoutes from './admin/language';
import MessageSubscriber from './admin/message-subscriber';
import NotificationRoutes from './admin/notification';
import OrderRoutes from './admin/order';
import PagesRoutes from './admin/pages';
import PaymentPayloadsRoutes from './admin/payment-payloads';
import ReceptRoutes from './admin/recept';
import RecipeCategoriesRoutes from './admin/recipe-categories';
import RefundsRoutes from './admin/refunds';
import RestraurantRoutes from './admin/restaurant';
import ReviewRoutes from './admin/reviews';
import SettingsRoutes from './admin/settings';
import ShopTag from './admin/shop-tag';
import ShopRoutes from './admin/shop';
import SMSPayloads from './admin/smsPayloads';
import SubscriptionsRoutes from './admin/subscriptions';
import UnitRoutes from './admin/unit';
import UsersRoutes from './admin/user';
import ReportRoutes from './admin/report';
import LandingPageRoutes from './admin/landing-page';
import ParcelOrderRoutes from './admin/parcelOrder';
import Advert from './admin/advert';
import ShopAds from './admin/shop-ads';
import PaymentToPartnersRoutes from './admin/payment-to-partners';
import PropertiesRoutes from './admin/property';
import DeliveryPointRoutes from './admin/delivery-point';
import Deliveryzone from './admin/deliveryzone';
import DeliveryPriceRoutes from './admin/delivery-pricing';
import WarehouseRoutes from './admin/warehouse';
import LooksRoutes from './admin/looks';
import ServicesRoutes from './admin/services';
import ServiceCategoryRoutes from './admin/service-category';
import MembershipRoutes from './admin/membership';
import BookingRoutes from './admin/booking';
import AdminServiceMasterRoutes from './admin/service-master';

// ** seller routes ** -----------
import SellerAddonRoutes from './seller/addon';
import SellerAppRoutes from './seller/app';
import SellerBonusRoutes from './seller/bonus';
import SellerBookingTableRoutes from './seller/booking-tables';
import SellerBookingTimeRoutes from './seller/booking-time';
import SellerBookingZoneRoutes from './seller/booking-zone';
import SellerBranchRoutes from './seller/branch';
import SellerBrandRoutes from './seller/brand';
import SellerCategoryImport from './seller/category';
import SellerDiscountsRoutes from './seller/discounts';
import SellerExtrasImport from './seller/extras';
import SellerFoodRoutes from './seller/food';
import SellerGalleryRoutes from './seller/gallery';
import SellerOrderRoutes from './seller/order';
import SellerPaymentRoutes from './seller/payments';
import SellerReceptCategoryRoutes from './seller/recept-category';
import SellerReceptRoutes from './seller/recept';
import SellerRefundsRoutes from './seller/refunds';
import SellerReportRoutes from './seller/report';
import SellerReviewRoutes from './seller/reviews';
import SellerStoryRoutes from './seller/story';
import SellerSubscriptionsRoutes from './seller/subscriptions';
import SellerAdvertRoutes from './seller/advert';
import SellerWalletRoutes from './seller/wallet';
import SellerPaymentFromPaymentRoutes from './seller/payment-from-partner';
import SellerPropertyImport from './seller/property';
import SellerCouponRoutes from './seller/coupons';
import SellerLooksRoutes from './seller/looks';
import SellerDeliveryPriceRoutes from './seller/delivery-price';
import SellerServicesRoutes from './seller/services';
import SellerDeliverymenRoutes from './seller/deliverymen';
import SellerGiftCardsRoutes from './seller/gift-cards';
import SellerMembershipRoutes from './seller/membership';
import SellerBookingRoutes from './seller/bookings';
// ** waiter routes ** ----------------
import WaiterAppRoutes from './waiter/app';
import WaiterOrderRoutes from './waiter/order';
// ** master routes ** ----------------
import MasterServiceRoutes from './master/services';
import MasterClosedDaysRoutes from './master/closed-days';
import MasterGalleryRoutes from './master/gallery';
import SellerInvitationRouts from './seller/invitations';
import MasterDisabledTimesRoutes from './master/disabled-times';
import FormOptionsRoutes from './admin/form-options';
import SellerFormOptionsRoutes from './seller/form-options';
import MasterFormOptionsRoutes from './master/form-options';
import ServiceExtraRoutes from './admin/service-extra';
import UserMembershipsRoutes from './admin/user-memberships';
import SellerUserMembershipsRoutes from './seller/user-memberships';
import GiftCardsRoutes from './admin/gift-cards';
import UserGiftCardsRoutes from './admin/user-gift-cards';
import MasterServiceNotificationsRoutes from './master/service-notifications';
import AdminServiceNotificationsRoutes from './admin/service-notifications';
import SellerServiceNotificationsRoutes from './seller/service-notifications';
import SellerServiceMasterRoutes from './seller/service-master';
import ShopSubscriptionsRoutes from './admin/shop-subscriptions';
import SellerMySubscriptionsRoutes from './seller/my-subscriptions';

// ** Merge Routes
const AllRoutes = [
  ...AppRoutes,
  ...AddonRoutes,
  ...BannerRoutes,
  ...BlogRoutes,
  ...BrandRoutes,
  ...CareerCategoryRoutes,
  ...CareerRoutes,
  ...CategoryImport,
  ...CouponRoutes,
  ...CurrencyRoutes,
  ...DeliveryRoutes,
  ...EmailProvidersRoutes,
  ...ExtrasRoutes,
  ...FaqRoutes,
  ...FoodRoutes,
  ...GalleryRoutes,
  ...LanguagesRoutes,
  ...MessageSubscriber,
  ...NotificationRoutes,
  ...OrderRoutes,
  ...PagesRoutes,
  ...PaymentPayloadsRoutes,
  ...ReceptRoutes,
  ...RecipeCategoriesRoutes,
  ...RefundsRoutes,
  ...RestraurantRoutes,
  ...ReviewRoutes,
  ...SettingsRoutes,
  ...ShopTag,
  ...ShopRoutes,
  ...SMSPayloads,
  ...SubscriptionsRoutes,
  ...UnitRoutes,
  ...UsersRoutes,
  ...ReportRoutes,
  ...LandingPageRoutes,
  ...ParcelOrderRoutes,
  ...Advert,
  ...ShopAds,
  ...PaymentToPartnersRoutes,
  ...PropertiesRoutes,
  ...DeliveryPointRoutes,
  ...Deliveryzone,
  ...DeliveryPriceRoutes,
  ...WarehouseRoutes,
  ...LooksRoutes,
  ...ServicesRoutes,
  ...ServiceCategoryRoutes,
  ...MembershipRoutes,
  ...BookingRoutes,
  ...FormOptionsRoutes,
  ...ServiceExtraRoutes,
  ...UserMembershipsRoutes,
  ...GiftCardsRoutes,
  ...UserGiftCardsRoutes,
  ...AdminServiceNotificationsRoutes,
  ...AdminServiceMasterRoutes,
  ...ShopSubscriptionsRoutes,
  // seller routes
  ...SellerAppRoutes,
  ...SellerAddonRoutes,
  ...SellerBonusRoutes,
  ...SellerBookingTableRoutes,
  ...SellerBookingTimeRoutes,
  ...SellerBookingZoneRoutes,
  ...SellerBranchRoutes,
  ...SellerBrandRoutes,
  ...SellerCategoryImport,
  ...SellerDiscountsRoutes,
  ...SellerFoodRoutes,
  ...SellerGalleryRoutes,
  ...SellerOrderRoutes,
  ...SellerRefundsRoutes,
  ...SellerReviewRoutes,
  ...SellerSubscriptionsRoutes,
  ...SellerReportRoutes,
  ...SellerExtrasImport,
  ...SellerPaymentRoutes,
  ...SellerReceptCategoryRoutes,
  ...SellerReceptRoutes,
  ...SellerStoryRoutes,
  ...SellerAdvertRoutes,
  ...SellerWalletRoutes,
  ...SellerPaymentFromPaymentRoutes,
  ...SellerPropertyImport,
  ...SellerCouponRoutes,
  ...SellerLooksRoutes,
  ...SellerDeliveryPriceRoutes,
  ...SellerServicesRoutes,
  ...SellerInvitationRouts,
  ...SellerGiftCardsRoutes,
  ...SellerMembershipRoutes,
  ...SellerBookingRoutes,
  ...SellerFormOptionsRoutes,
  ...SellerUserMembershipsRoutes,
  ...SellerServiceNotificationsRoutes,
  ...SellerServiceMasterRoutes,
  ...SellerMySubscriptionsRoutes,
  // ...SellerDeliverymenRoutes,

  // waiter routes
  ...WaiterAppRoutes,
  ...WaiterOrderRoutes,

  // master routes
  ...MasterServiceRoutes,
  ...MasterClosedDaysRoutes,
  ...MasterGalleryRoutes,
  ...MasterDisabledTimesRoutes,
  ...MasterFormOptionsRoutes,
  ...MasterServiceNotificationsRoutes,
];

export { AllRoutes };

'use client';

import CallMeBackModal from "@/components/CallMeBackModal";
import { useScrollModal } from "@/hooks/useScrollModal";

const CategoryPageClient = () => {
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });

  return <CallMeBackModal isOpen={showModal} onClose={closeModal} />;
};

export default CategoryPageClient;


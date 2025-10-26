import React from "react";
import ResponsiveFlow from "../../../shared/components/layout/ResponsiveFlow";
import ToggleBox from "../components/ToggleBox";
import MultiStateButton from "../components/MultiStateButton";
import SequentialButton, { SequentialButtonEvent, SequentialButtonKeyframes} from "../components/SequentialButton";
import { ModalController } from "../components/ModalController";
import { StaggeredList } from "../components/StaggeredList";
import { ExpandedList } from "../components/ExpandedList";
import { DraggableStack, SimpleUseSpringExample } from "../components/DraggableStack";
import { NewsTickerInfinite } from "../components/NewsTicker";
import { FeatureCardsTrail } from "../components/FeatureCardsTrail";
import { NotificationTransition } from "../components/NotificationTransition";
import { LoadingSequence } from "../components/use-chain/LoadingSequence";
import NeonChainExample from "../components/use-chain/NeonChainExample";
import Gallery from "../components/use-transition/Gallery";
import Card3D from "../components/use-gesture/Card3D";
import DraggableNote from "../components/use-gesture/DraggableNote";

const AnimationPage = () => {
    return (
        <ResponsiveFlow>
            <Card3D />
            <DraggableNote />
            <LoadingSequence />
            <NeonChainExample />
            <Gallery />
            <NeonChainExample />
            <FeatureCardsTrail />
            <NotificationTransition />
            <ToggleBox />
            <MultiStateButton />
            <SequentialButton />
            <SequentialButtonEvent />
            <SequentialButtonKeyframes />
            <ModalController />
            <StaggeredList />
            <ExpandedList />
            <DraggableStack />
            <SimpleUseSpringExample />
            <NewsTickerInfinite />
            
        </ResponsiveFlow>
    );
};
export default AnimationPage;
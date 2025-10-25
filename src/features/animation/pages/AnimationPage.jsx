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

const AnimationPage = () => {
    return (
        <ResponsiveFlow>
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
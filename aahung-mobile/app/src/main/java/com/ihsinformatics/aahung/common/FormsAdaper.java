package com.ihsinformatics.aahung.common;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.ihsinformatics.aahung.R;
import com.ihsinformatics.aahung.model.FormDetails;
import com.ihsinformatics.aahung.views.DataProvider;

import java.util.List;

public class FormsAdaper extends RecyclerView.Adapter<FormsAdaper.FormViewHolder> {

    private List<FormDetails> formDetailsList;
    private FormAdapterListener formListener;
    private Context context;


    public FormsAdaper(Context context, List<FormDetails> formDetailsList, FormAdapterListener formListener) {
        this.context = context;
        this.formDetailsList = formDetailsList;
        this.formListener = formListener;
    }

    @NonNull
    @Override
    public FormViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_form, parent, false);
        return new FormViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull FormViewHolder holder, int position) {
        holder.image.setImageResource(formDetailsList.get(position).getForms().getImageID());
        holder.title.setText(formDetailsList.get(position).getForms().getName());
        holder.desc.setText(context.getResources().getString(formDetailsList.get(position).getForms().getDescription()));
        holder.card.setOnClickListener(new CustomClickListener(position));
        if (formDetailsList.get(position).getForms().isLocationDependent())
            holder.locationEnabled.setVisibility(View.VISIBLE);
        else
            holder.locationEnabled.setVisibility(View.GONE);
    }

    @Override
    public int getItemCount() {
        return formDetailsList.size();
    }

    static class FormViewHolder extends RecyclerView.ViewHolder {

        ImageView image;
        ImageView locationEnabled;
        CardView card;
        TextView title;
        TextView desc;


        FormViewHolder(@NonNull View itemView) {
            super(itemView);
            image = itemView.findViewById(R.id.form_image);
            locationEnabled = itemView.findViewById(R.id.location_dependent);
            title = itemView.findViewById(R.id.form_title);
            desc = itemView.findViewById(R.id.form_desc);
            card = itemView.findViewById(R.id.root);
        }
    }

    private class CustomClickListener implements View.OnClickListener {
        private int position;

        public CustomClickListener(int position) {
            this.position = position;
        }

        @Override
        public void onClick(View view) {
            if (GlobalConstants.selectedSchool == null && formDetailsList.get(position).getForms().getFormCategory().equals(DataProvider.FormCategory.LSE) && formDetailsList.get(position).getForms().isLocationDependent())
                formListener.showError("Please Select school first");
            else if (GlobalConstants.selectedInstitute == null && formDetailsList.get(position).getForms().getFormCategory().equals(DataProvider.FormCategory.SRHM) && formDetailsList.get(position).getForms().isLocationDependent())
                formListener.showError("Please select institute first");
            else
                formListener.onFormClicked(formDetailsList.get(position));
        }
    }
}
